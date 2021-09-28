const { MessageActionRow, MessageButton } = require("discord.js")

const getButtonRow = function(buttonsInfo) {
  let row = new MessageActionRow()
  let disabled = buttonsInfo.disabled ? true : false
  buttonsInfo.buttons.forEach(button => {
    let thisButton = new MessageButton()
      .setCustomId(button.id)
      .setLabel(button.name)
      .setDisabled(disabled)
      .setStyle( buttonsInfo.disabled ? (button.picked ? "SUCCESS" : "SECONDARY") : "PRIMARY" )
    row.addComponents(thisButton)
  })
  return row
}

module.exports = { getButtonRow }