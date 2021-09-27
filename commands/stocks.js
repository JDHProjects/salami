const yahooFinance = require("yahoo-finance")

const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "stocks",
  description: "Trade your salami against the real stock market! Any stock you can find on yahoo finances can be bought and sold with salami. Salami uses premarket and after hours prices, so trade around the clock!",
  usage: "\n`stocks price <STOCK SYMBOL>` to see current stock market prices\n`stocks portfolio` to list all your stocks\n`stocks buy <STOCK SYMBOL> <SALAMI AMOUNT>` to buy some stock with salami\n`stocks sell <STOCK SYMBOL> <SALAMI AMOUNT>` to sell some stock for salami",
  example: "buy GME 10000",
  tested: true,
  execute: async function(message, args) {
    const { bankAccounts, stocks } = require("../db/db.js")
    const { transfer } = require("../db/functions/transfer.js")


    if (args[0] == "price"){
      if (args.length === 2){
        let resp = await getPrice(args[1].toUpperCase())
        if (resp == "ticker not found"){
          return await sendMessage.reply(message, "Stock ticker not found")
        }
        let msg = "Market is                  :   " + resp.marketType + "\n"

        msg += resp.symbol + "                          :   " + resp.price.toPrecision(5) + " "+resp.currency+"\n"
        msg += resp.symbol + "                          :   "+resp.salamiPrice + " salami" + "\n"
        msg += "Percentage Change:   " + Math.round(resp.percentChange*100000)/1000 + "%"
        return await sendMessage.send(message, msg)
      }
      else{
        return await sendMessage.reply(message, "Stock ticker arg not found")
      }
    }
    else if (args[0] == "buy"){
      if (args.length === 3){
        let salamiAmount = Math.abs(parseInt(args[2]))
        if (!isNaN(salamiAmount) && salamiAmount >= 1) { 
          let buyer = await bankAccounts.findByPk(message.author.id)
          if(buyer.dataValues.money >= salamiAmount) {
            let ticker = args[1].toUpperCase()
            let resp = await getPrice(ticker)
            if (resp == "ticker not found"){
              return await sendMessage.reply(message, "Stock ticker not found")
            }
            let sharesToBuy = salamiAmount / resp.salamiPrice
            let userStock = await stocks.findOrCreate({
              where: { user_id: message.author.id, stock: ticker }
            })
            let averageCost = (userStock[0].dataValues.quantity * userStock[0].dataValues.average_cost
                    + 
                    salamiAmount)
                    /
                    (userStock[0].dataValues.quantity + sharesToBuy)
            await userStock[0].increment("quantity", {by: sharesToBuy})
            await userStock[0].update({average_cost:averageCost})
            let bank = await bankAccounts.findByPk("0")
            await transfer(buyer,bank,salamiAmount)
            return await sendMessage.reply(message, "\nYou have bought " + Math.round(sharesToBuy*10000)/10000 + " shares \nAt "+resp.salamiPrice + " salami per share")
          }
          return await sendMessage.reply(message, "you don't have enough salami to buy this stock")
        }
        return await sendMessage.reply(message, "Salami amount not a number or 0")
      }
      return await sendMessage.reply(message, "Stock ticker or number of salami arg not found")
    }
    else if (args[0] == "sell"){
      if (args.length === 3){
        let amount = args[2].toLowerCase()
        let salamiAmount = Math.abs(parseInt(args[2]))
        if (!isNaN(salamiAmount) || amount == "all" || amount == "half") { 
          let seller = await bankAccounts.findByPk(message.author.id)
          let ticker = args[1].toUpperCase()
          let stock = await stocks.findOne({
            where: { user_id: message.author.id, stock: ticker }
          })
          if (stock != undefined && stock.dataValues.quantity > 0){
            let resp = await getPrice(ticker)
            if(amount == "half" || amount == "all" || (Math.round(stock.dataValues.quantity * resp.salamiPrice) >= salamiAmount)){
              let bank = await bankAccounts.findByPk("0")
              let sharesToSell = 0
              if (amount == "half"){
                sharesToSell = stock.dataValues.quantity / 2
              } else if(amount == "all") {
                sharesToSell = stock.dataValues.quantity
              } else {
                sharesToSell = salamiAmount / resp.salamiPrice
              }
              salamiAmount = sharesToSell * resp.salamiPrice
      
              await transfer(bank,seller,salamiAmount)
              if (sharesToSell == stock.dataValues.quantity){
                await stock.destroy()
              }
              else {
                await stock.decrement("quantity", { by:  sharesToSell })
              }
              return await sendMessage.reply(message, "\nYou have sold " + Math.round(sharesToSell*10000)/10000 + " shares \nAt "+resp.salamiPrice + " salami per share\nFor a total of: "+Math.round(salamiAmount)+" salami")
            }
            return await sendMessage.reply(message, "you don't own enough stock to sell for that much salami")
          }
          return await sendMessage.reply(message, "you don't own that stock")
        }
        return await sendMessage.reply(message, "Salami amount not a number, half or full")
      }
      return await sendMessage.reply(message, "Stock ticker or number of salami arg not found")
    }
    else if (args[0] == "portfolio"){
      let userStocks = await stocks.findAll({where: {user_id: message.author.id}})
      let msg = ""
      let stockPromises = []
      userStocks.forEach(stock => {
        stockPromises.push(getStockInfo(stock))
      })
      let values = (await Promise.all(stockPromises))
      if (values.length > 0) {
        msg += " you own:\n"
        values.forEach(value => {
          msg += value
        })
      }
      else {
        msg += " you don't own any stocks"
      }
      return await sendMessage.splitSend(message, `<@${message.author.id}>`+msg)
    }
    else {
      return await sendMessage.reply(message, "No valid args supplied with your message")
    }
  },
}

const getPrice = async function(ticker) {
  try {
    //needed to mask warning output from yahoo finance. Warning is: root.Api.main context.dispatcher.stores.CrumbStore.crumb structure no longer exists, please open an issue.
    let oldConsoleWarn = console.warn
    console.warn = () => {}
    let info = await yahooFinance.quote(ticker, ["price"])
    console.warn = oldConsoleWarn
    if (info.price.regularMarketPrice === undefined){
      return "ticker not found"
    }
    let marketType = info.price.marketState === "REGULAR" ?
      "Open" :
      info.price.marketState === "PRE" ? 
        "Premarket" :
        info.price.marketState === "POST" ?
          "After hours" :
          "Closed"

    let price = marketType === "Open" ?
      info.price.regularMarketPrice :
      marketType === "Premarket" ? 
        info.price.preMarketPrice : 
        info.price.postMarketPrice

    if(price == undefined){
      price = info.price.regularMarketPrice
    }

    let percentChange = marketType == "Open" ?
      info.price.regularMarketChangePercent :
      marketType == "Premarket" ? 
        info.price.preMarketChangePercent : 
        info.price.postMarketChangePercent

    if(percentChange == undefined){
      percentChange = info.price.regularMarketChangePercent
    }

    let salamiPrice = price >= 0.01 ? Math.round(price * 100) : 1

    return  {"symbol":info.price.symbol,
      "price":price,
      "salamiPrice":salamiPrice,
      "marketType":marketType,
      "percentChange":percentChange,
      "currency":info.price.currency
    }
  } catch {
    return "ticker not found"
  }
}

const getStockInfo = async function(stock) {
  let resp = await getPrice(stock.dataValues.stock)
  let percentGain = ((resp.salamiPrice - stock.dataValues.average_cost) / stock.dataValues.average_cost) * 100
  let salamiGain = (resp.salamiPrice - stock.dataValues.average_cost) * stock.dataValues.quantity
  let msg = "Stock                       :   " + stock.dataValues.stock + "\n"
  msg += "Quantity                 :   " + stock.dataValues.quantity.toPrecision(5)  + "\n"
  msg += "Value                      :   " + Math.round(stock.dataValues.quantity*resp.salamiPrice) + " salami\n"
  msg += "Average Cost        :   " + Math.round(stock.dataValues.average_cost*100)/100 + "\n"
  msg += "Percentage Gain   :   " + Math.round(percentGain * 100) / 100 + "%\n"
  msg += "Total Salami Gain :   " + Math.round(salamiGain) + " salami\n\n"

  return msg
}