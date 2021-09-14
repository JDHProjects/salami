const yahooFinance = require('yahoo-finance');

module.exports = {
    name: 'stocks',
    description: 'Trade your salami against the real stock market! Any stock you can find on yahoo finances can be bought and sold with salami (10000 salami to 1 USD). Salami uses premarket and after hours prices, so trade around the clock!',
    usage: '\n\`stocks price <STOCK SYMBOL>\` to see current stock market prices\n\`stocks portfolio\` to list all your stocks\n\`stocks buy <STOCK SYMBOL> <SALAMI AMOUNT>\` to buy some stock with salami\n\`stocks sell <STOCK SYMBOL> <SALAMI AMOUNT>\` to sell some stock for salami',
    example: 'buy GME 10000',
	execute(message, args) {
    const { bankAccounts, stocks } = require('../db/db.js')
    const { transfer } = require('../db/functions/transfer.js')


    if (args[0] == "price"){
      if (args.length === 2){
        getPrice(args[1].toUpperCase())
        .then(resp => {
          let msg = "Market is:   " + resp.marketType + "\n";

          msg += resp.symbol + "   : " + resp.price.toPrecision(5) + " "+resp.currency+"\n"
          msg += resp.symbol +"   : "+resp.salamiPrice + " salami" + "\n"
          msg += "Percentage Change:   " + Math.round(resp.percentChange*100000)/1000 + "%"
          message.channel.send(msg)
          
        })
        .catch(err => {
          message.reply("Stock ticker not found")
        })
      }
      else{
        message.reply("Stock ticker arg not found")
      }
    }
    else if (args[0] == "buy"){
      if (args.length === 3){
        let salamiAmount = Math.abs(parseInt(args[2]))
        if (!isNaN(salamiAmount) && salamiAmount >= 1) { 
          bankAccounts.findByPk(message.author.id)
          .then(buyer => {
            if(buyer.dataValues.money >= salamiAmount) {
              let ticker = args[1].toUpperCase()
              getPrice(ticker)
              .then(resp => {
                let sharesToBuy = salamiAmount / resp.salamiPrice
                stocks.findOrCreate({
                  where: { user_id: message.author.id, stock: ticker }
                  })
                .then(userStock => {
                  averageCost = (userStock[0].dataValues.quantity * userStock[0].dataValues.average_cost
                                + 
                                salamiAmount)
                                /
                                (userStock[0].dataValues.quantity + sharesToBuy)
                  
                  userStock[0].increment('quantity', {by: sharesToBuy})
                  userStock[0].update({average_cost:averageCost})
                  bankAccounts.findByPk("0")
		              .then(bank => {
                    transfer(buyer,bank,salamiAmount)
                    message.reply("\nYou have bought " + Math.round(sharesToBuy*10000)/10000 + " shares \nAt "+resp.salamiPrice + " salami per share")
                  })
                })
                
                
              })
              .catch(err => {
                message.reply("stock ticker not found")
              })
            }
            else {
              message.reply("you don't have enough salami to buy this stock")
            }
          });
        }
        else {
          message.reply("Salami amount not a number or 0")
        }
      }
      else{
        message.reply("Stock ticker or number of salami arg not found")
      }
    }
    else if (args[0] == "sell"){
      if (args.length === 3){
        let amount = args[2].toLowerCase()
        let salamiAmount = Math.abs(parseInt(args[2]))
        if (!isNaN(salamiAmount) || amount == "all" || amount == "half") { 
          bankAccounts.findByPk(message.author.id)
          .then(seller => {
            let ticker = args[1].toUpperCase()
            stocks.findOne({
              where: { user_id: message.author.id, stock: ticker }
              })
            .then(stock => {
              if (stock != undefined && stock.dataValues.quantity > 0){
                getPrice(ticker)
                .then(resp => {
                  if(amount == "half" || amount == "all" || (Math.round(stock.dataValues.quantity * resp.salamiPrice) >= salamiAmount)){
                    bankAccounts.findByPk("0")
                    .then(bank => {
                      let sharesToSell = 0
                      if (amount == "half"){
                        sharesToSell = stock.dataValues.quantity / 2
                      } else if(amount == "all") {
                        sharesToSell = stock.dataValues.quantity
                      } else {
                        sharesToSell = salamiAmount / resp.salamiPrice
                      }
                      salamiAmount = sharesToSell * resp.salamiPrice
                      
                      transfer(bank,seller,salamiAmount)
                      stock.decrement("quantity", { by:  sharesToSell })
                      message.reply("\nYou have sold " + Math.round(sharesToSell*10000)/10000 + " shares \nAt "+resp.salamiPrice + " salami per share\nFor a total of: "+Math.round(salamiAmount)+" salami")
                    })
                  }
                  else{
                    message.reply("you don't own enough stock to sell for that much salami")
                  }
                })
              }
              else {
                message.reply("you don't own that stock")
              }
            })
          })
        }
        else {
          message.reply("Salami amount not a number")
        }
      }
      else{
        message.reply("Stock ticker or number of salami arg not found")
      }
    }
    else if (args[0] == "portfolio"){
      stocks.findAll({where: {user_id: message.author
        .id}})
      .then(stocks => {
        let msg = ""
        stockPromises = []
        stocks.forEach(stock => {
          stockPromises.push(getStockInfo(stock))
        });
        Promise.all(stockPromises).then(values => {
          let filterValues = values.filter(value => value != '');
          if (filterValues.length > 0) {
            msg += " you own:\n"
            filterValues.forEach(value => {
              msg += value
            })
          }
          else {
            msg += " you don't own any stocks"
          }
          message.channel.send(`<@${message.author.id}>,`+msg, { split: true })
        })
      })
    }
    else {
      message.reply("No valid args supplied with your message")
    }
	},
};

const getPrice = function(ticker) {
	return new Promise(function(resolve, reject) {
    yahooFinance.quote(ticker, ["price"])
    .then(info => { 
      if (info.price.regularMarketPrice === undefined){
        reject("ticker not found");
      }
      let marketType = info.price.marketState === "REGULAR" ?
                         "Open" :
                         info.price.marketState === "PRE" ? 
                          "Premarket" :
                          info.price.marketState === "POST" ?
                            "After hours" :
                            "Closed";

      let price = marketType === "Open" ?
                    info.price.regularMarketPrice :
                    marketType === "Premarket" ? 
                      info.price.preMarketPrice : 
                      info.price.postMarketPrice;

      if(price == undefined){
        price = info.price.regularMarketPrice;
      }

      let percentChange = marketType == "Open" ?
                            info.price.regularMarketChangePercent :
                            marketType == "Premarket" ? 
                              info.price.preMarketChangePercent : 
                              info.price.postMarketChangePercent;

      if(percentChange == undefined){
        percentChange = info.price.regularMarketChangePercent;
      }

      let salamiPrice = price >= 0.01 ? Math.round(price * 100) : 1;

      resolve( {"symbol":info.price.symbol,
                "price":price,
                "salamiPrice":salamiPrice,
                "marketType":marketType,
                "percentChange":percentChange,
                "currency":info.price.currency
               } );
    })
    .catch(err => {
      reject("ticker not found");
    })
  })
}

const getStockInfo = function(stock) {
	return new Promise(function(resolve, reject) {
    let msg = ""
    if (stock.dataValues.quantity > 0){
      getPrice(stock.dataValues.stock)
      .then( resp => {
        let percentGain = ((resp.salamiPrice - stock.dataValues.average_cost) / stock.dataValues.average_cost) * 100
        let salamiGain = (resp.salamiPrice - stock.dataValues.average_cost) * stock.dataValues.quantity
        msg += "Stock                       :   " + stock.dataValues.stock + "\n"
        msg += "Quantity                 :   " + stock.dataValues.quantity.toPrecision(5)  + "\n"
        msg += "Value                      :   " + Math.round(stock.dataValues.quantity*resp.salamiPrice) + " salami\n"
        msg += "Average Cost        :   " + Math.round(stock.dataValues.average_cost*100)/100 + "\n"
        msg += "Percentage Gain   :   " + Math.round(percentGain * 100) / 100 + "%\n"
        msg += "Total Salami Gain :   " + Math.round(salamiGain) + " salami\n\n"
        
        resolve(msg);
      })
    }
    else{
      stock.update({quantity:0})
      resolve(msg);
    }

  })
}