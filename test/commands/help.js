const assert = require("assert")

const { execute } = require("../../commands/help.js")

const { dummyMessageWithCommands, dummyMessageWithCommandsAsAdmin } = require("../helpers/dummyMessages.js")

describe("The help command", function() {

  it("should respond correctly to an invalid command", async function() {
    let idealMessage = "that's not a valid command!"
    let actualMessage = (await execute(dummyMessageWithCommands, ["invalid_command"]))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to a user listing all commands", async function() {
    let idealMessage = "Here's a list of all my commands:\nnon_admin_command\n\nYou can send `>help [command name]` to get info on a specific command!"
    let actualMessage = (await execute(dummyMessageWithCommands, []))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to an admin listing all commands", async function() {
    let idealMessage = "Here's a list of all my commands:\nnon_admin_command\n\nYou're an admin, so here's a list of the admin commands you can use:\nadmin_command\n\nYou can send `>help [command name]` to get info on a specific command!"
    let actualMessage = (await execute(dummyMessageWithCommandsAsAdmin, []))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to a user accessing a command", async function() {
    let idealMessage = "**Name:** non_admin_command\n**Description:** valid description\n**Usage:** valid usage\n**Example:** >non_admin_command valid example"
    let actualMessage = (await execute(dummyMessageWithCommands, ["non_admin_command"]))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to an admin accessing an admin command", async function() {
    let idealMessage = "**Name:** admin_command\n**Description:** valid description\n**Usage:** valid usage\n**Example:** >admin_command valid example"
    let actualMessage = (await execute(dummyMessageWithCommandsAsAdmin, ["admin_command"]))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to a non-admin trying to access an admin command", async function() {
    let idealMessage = "You're not an admin!"
    let actualMessage = (await execute(dummyMessageWithCommands, ["admin_command"]))[0]
    
    assert.equal(idealMessage, actualMessage)
  })
})
