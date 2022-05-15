const { MessageActionRow, MessageSelectMenu } = require("discord.js")

const getSelectMenu = function(optionsInfo) {
  let menu = new MessageSelectMenu()
    .setCustomId(optionsInfo.id)
    //.setPlaceholder(optionsInfo.placeholder)
    .setDisabled(optionsInfo.disabled)
  let longList = optionsInfo.options.length > 25
  let optionsList = longList ? optionsInfo.options.slice(0,23) : optionsInfo.options 
  optionsList.forEach((option,index) => {
    menu.addOptions([
      {
        label: option.label,
        description: option.description,
        value: option.value,
        emoji: option.emoji,
        default: index == optionsInfo.defaultOption ? true :false
      }
    ])
  })

  /*if(longList){
    // do stuff  
  }*/
  let row = new MessageActionRow()
    .addComponents(menu)
  return row
}

module.exports = { getSelectMenu }