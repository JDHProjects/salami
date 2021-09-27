const assert = require("assert")

const { execute } = require("../../commands/stocks.js")
const { stocks } = require("../../db/db.js")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const { getUserMoney } = require("../helpers/getUserMoney.js")
const { setUserMoney } = require("../helpers/setUserMoney.js")

describe("The stocks command", function() {
  
  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  
  it("should respond correctly with no args", async function() {
    let idealMessage = "No valid args supplied with your message"
    let actualMessage = (await execute({}, [])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using price subcommand with no args", async function() {
    let idealMessage = "Stock ticker arg not found"
    let actualMessage = (await execute({}, ["price"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using price subcommand with invalid ticker", async function() {
    let idealMessage = "Stock ticker not found"
    let actualMessage = (await execute({}, ["price", "invalid_ticker"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using price subcommand with valid ticker", async function() {
    let idealMessage = /Market is {18}: {3}.+\n\^FTSE {26}: {3}.+\n\^FTSE {26}: {3}.+\nPercentage Change: {3}.+%/g
    let actualMessage = (await execute({}, ["price", "^FTSE"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(1, matches.length)
  })

  it("should respond correctly when using buy subcommand with no args", async function() {
    let idealMessage = "Stock ticker or number of salami arg not found"
    let actualMessage = (await execute({}, ["buy"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using buy subcommand with no quantity", async function() {
    let idealMessage = "Salami amount not a number or 0"
    let actualMessage = (await execute({}, ["buy", "^FTSE", "invalid_amount"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using buy subcommand with not enough money", async function() {
    await setUserMoney(0)
    let idealMessage = "you don't have enough salami to buy this stock"
    let actualMessage = (await execute(dummyMessage, ["buy", "^FTSE", "100"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using buy subcommand with invalid ticker", async function() {
    await setUserMoney(100)
    let idealMessage = "Stock ticker not found"
    let actualMessage = (await execute(dummyMessage, ["buy", "invalid_ticker", "100"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when user buys a stock", async function() {
    await setUserMoney(100)
    let idealMessage = /\nYou have bought .+ shares \nAt .+ salami per share/g
    let actualMessage = (await execute(dummyMessage, ["buy", "^FTSE", "100"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }

    assert.equal(1, matches.length)
  })

  it("should decrement user money when user buys a stock", async function() {
    await setUserMoney(100)
    await execute(dummyMessage, ["buy", "^FTSE", "100"])

    assert.equal(0, await getUserMoney())
  })

  it("should give user a stock when user buys a stock", async function() {
    await setUserMoney(100)
    await execute(dummyMessage, ["buy", "^FTSE", "100"])
    let stockResp = await stocks.findOne({where: {user_id: "12345", stock: "^FTSE"}})
    assert.notEqual(stockResp, null)
    assert.ok(stockResp.dataValues.quantity > 0)
  })

  it("should respond correctly when using sell subcommand with no args", async function() {
    let idealMessage = "Stock ticker or number of salami arg not found"
    let actualMessage = (await execute({}, ["sell"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using sell subcommand with no quantity", async function() {
    let idealMessage = "Salami amount not a number, half or full"
    let actualMessage = (await execute({}, ["sell", "^FTSE", "invalid_amount"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using sell subcommand without owning the stock", async function() {
    let idealMessage = "you don't own that stock"
    let actualMessage = (await execute(dummyMessage, ["sell", "^FTSE", "all"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when user tries to sell more stock than they own", async function() {
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 0.00001, average_cost: 0})

    let idealMessage = "you don't own enough stock to sell for that much salami"
    let actualMessage = (await execute(dummyMessage, ["sell", "^FTSE", "1000000"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when user tries to sell 10 money of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    let idealMessage = /\nYou have sold .+ shares \nAt .+ salami per share\nFor a total of: .+ salami/g
    let actualMessage = (await execute(dummyMessage, ["sell", "^FTSE", "10"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }

    assert.equal(1, matches.length)
  })

  it("should decrement quantity when user tries to sell 10 money of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    await execute(dummyMessage, ["sell", "^FTSE", "10"])
    let stockResp = await stocks.findOne({where: {user_id: "12345", stock: "^FTSE"}})
    assert.notEqual(stockResp, null)
    assert.ok(stockResp.dataValues.quantity < 10)
  })

  it("should pay user when user tries to sell 10 money of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    await execute(dummyMessage, ["sell", "^FTSE", "10"])
    assert.equal(await getUserMoney(), 10)
  })

  it("should respond correctly when user tries to sell half of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    let idealMessage = /\nYou have sold .+ shares \nAt .+ salami per share\nFor a total of: .+ salami/g
    let actualMessage = (await execute(dummyMessage, ["sell", "^FTSE", "half"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }

    assert.equal(1, matches.length)
  })

  it("should decrement quantity when user tries to sell half of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    await execute(dummyMessage, ["sell", "^FTSE", "half"])
    let stockResp = await stocks.findOne({where: {user_id: "12345", stock: "^FTSE"}})
    assert.notEqual(stockResp, null)
    assert.equal(stockResp.dataValues.quantity, 5)
  })

  it("should pay user when user tries to sell half of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    await execute(dummyMessage, ["sell", "^FTSE", "half"])
    assert.ok(await getUserMoney() > 0)
  })

  it("should respond correctly when user tries to sell all of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    let idealMessage = /\nYou have sold .+ shares \nAt .+ salami per share\nFor a total of: .+ salami/g
    let actualMessage = (await execute(dummyMessage, ["sell", "^FTSE", "all"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }

    assert.equal(1, matches.length)
  })

  it("should delete stock when user tries to sell all of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    await execute(dummyMessage, ["sell", "^FTSE", "all"])
    let stockResp = await stocks.findOne({where: {user_id: "12345", stock: "^FTSE"}})
    assert.equal(stockResp, null)
  })

  it("should pay user when user tries to sell all of a stock", async function() {
    await setUserMoney(0)
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})
    
    await execute(dummyMessage, ["sell", "^FTSE", "all"])
    assert.ok(await getUserMoney() > 0)
  })

  it("should respond correctly when using portfolio subcommand with no stocks", async function() {
    let idealMessage = "<@12345> you don't own any stocks"
    let actualMessage = (await execute(dummyMessage, ["portfolio"])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when using portfolio subcommand with one stock", async function() {
    await stocks.create({user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0})

    let idealMessage = /<@12345> you own:\nStock {23}: {3}\^FTSE\nQuantity {17}: {3}10\.000\nValue {22}: {3}[0-9]+ salami\nAverage Cost {8}: {3}0\nPercentage Gain {3}: {3}.+%\nTotal Salami Gain : {3}[0-9]+ salami\n/g
    let actualMessage = (await execute(dummyMessage, ["portfolio"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }

    assert.equal(1, matches.length)
  })

  it("should respond correctly when using portfolio subcommand with multiple stocks", async function() {
    await stocks.bulkCreate([
      {user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0},
      {user_id: "12345", stock: "^FTMC", quantity: 10, average_cost: 0},
    ])

    let idealMessage = /<@12345> you own:\nStock {23}: {3}\^FTSE\nQuantity {17}: {3}10\.000\nValue {22}: {3}[0-9]+ salami\nAverage Cost {8}: {3}0\nPercentage Gain {3}: {3}.+%\nTotal Salami Gain : {3}[0-9]+ salami\n\nStock {23}: {3}\^FTMC\nQuantity {17}: {3}10\.000\nValue {22}: {3}[0-9]+ salami\nAverage Cost {8}: {3}0\nPercentage Gain {3}: {3}.+%\nTotal Salami Gain : {3}[0-9]+ salami\n/g
    let actualMessage = (await execute(dummyMessage, ["portfolio"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }

    assert.equal(1, matches.length)
  })

  it("should respond correctly when using portfolio subcommand with multiple stocks without displaying other users stocks", async function() {
    await stocks.bulkCreate([
      {user_id: "12345", stock: "^FTSE", quantity: 10, average_cost: 0},
      {user_id: "12345", stock: "^FTMC", quantity: 10, average_cost: 0},
      {user_id: "54321", stock: "^FTMC", quantity: 10, average_cost: 0},
      {user_id: "54321", stock: "^FTMC", quantity: 10, average_cost: 0},
    ])

    let idealMessage = /<@12345> you own:\nStock {23}: {3}\^FTSE\nQuantity {17}: {3}10\.000\nValue {22}: {3}[0-9]+ salami\nAverage Cost {8}: {3}0\nPercentage Gain {3}: {3}.+%\nTotal Salami Gain : {3}[0-9]+ salami\n\nStock {23}: {3}\^FTMC\nQuantity {17}: {3}10\.000\nValue {22}: {3}[0-9]+ salami\nAverage Cost {8}: {3}0\nPercentage Gain {3}: {3}.+%\nTotal Salami Gain : {3}[0-9]+ salami\n/g
    let actualMessage = (await execute(dummyMessage, ["portfolio"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }

    assert.equal(1, matches.length)
  })
})
