const messageDropdown = async function(message, messages, listOptions) {
  if(messages.length == 0){
    return
  }

  let page = 0
  if(messages.length == 1){
    return await sendMessage.reply(message, "", { ...messages[page], components: [getSelectMenu({ disabled: true, id: "dropdown_menu", defaultOption: page, options : listOptions})] })
  }

  let navigator = await sendMessage.reply(message, "", { ...messages[page], components: [getSelectMenu({ disabled: false, id: "dropdown_menu", defaultOption: page, options : listOptions})] })

  const filter = (m) => m.user.id === message.author.id

  while(page >= 0)
  {
    try {
      let menuResp = await navigator.awaitMessageComponent({ filter, time: 5000 })

      page = parseInt(menuResp.values[0])

      navigator = await sendMessage.edit(navigator, "", { ...messages[page], components: [getSelectMenu({ disabled: false, id: "dropdown_menu", defaultOption: page, options : listOptions})] })

      menuResp.deferUpdate()
    } catch {
      await sendMessage.edit(navigator, "", {...messages[page], components: [getSelectMenu({ disabled: true, id: "dropdown_menu", defaultOption: page, options : listOptions})] })
      page=-1
    }
  }
}

module.exports = { messageDropdown }