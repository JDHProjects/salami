const { getButtonRow } = require("../functions/getButtonRow.js")
const { sendMessage } = require("./sendMessage.js")

const messagePagination = async function(message, messages) {
  if(messages.length == 0){
    return
  }

  let page = 0
  if(messages.length == 1){
    return await sendMessage.reply(message, "", { ...messages[page], components: [getButtonRow({ disabled: true, buttons: [{ name:"<--", id:"first" },{ name:"<-", id:"prev" },{ name:`${page+1}`, id:"num", style: "SUCCESS" },{ name:"->", id:"next" },{ name:"-->", id:"last" }]})] })
  }

  let navigator = await sendMessage.reply(message, "", { ...messages[page], components: [getButtonRow({ buttons: [{ name:"<--", id:"first", disabled: true },{ name:"<-", id:"prev", disabled: true },{ name:`${page+1}`, id:"num", style: "SUCCESS", disabled: true },{ name:"->", id:"next" },{ name:"-->", id:"last" }]})] })

  const filter = (m) => m.user.id === message.author.id

  while(page >= 0)
  {
    try {
      let buttonResp = await navigator.awaitMessageComponent({ filter, time: 15000 })
    
      if (buttonResp.customId === "first") {
        page=0
      }
      else if (buttonResp.customId === "prev") {
        if(page > 0)
        {
          page--
        }
      }
      else if (buttonResp.customId === "next") {
        if(page+1 < messages.length)
        {
          page++
        }
      }
      else if (buttonResp.customId === "last") {
        page=messages.length-1
      }
      //navigator.delete().catch(_ => {})
      if(page == 0){
        navigator = await sendMessage.edit(navigator, "", { ...messages[page], components: [getButtonRow({ buttons: [{ name:"<--", id:"first", disabled: true },{ name:"<-", id:"prev", disabled: true },{ name:`${page+1}`, id:"num", style: "SUCCESS", disabled: true },{ name:"->", id:"next" },{ name:"-->", id:"last" }] })] })
      }
      else if (page+1 == messages.length){
        navigator = await sendMessage.edit(navigator, "", { ...messages[page], components: [getButtonRow({ buttons: [{ name:"<--", id:"first" },{ name:"<-", id:"prev" },{ name:`${page+1}`, id:"num", style: "SUCCESS", disabled: true },{ name:"->", id:"next", disabled: true },{ name:"-->", id:"last", disabled: true }] })] })
      }
      else{
        navigator = await sendMessage.edit(navigator, "", { ...messages[page], components: [getButtonRow({ buttons: [{ name:"<--", id:"first" },{ name:"<-", id:"prev" },{ name:`${page+1}`, id:"num", style: "SUCCESS", disabled: true },{ name:"->", id:"next" },{ name:"-->", id:"last" }] })] })
      }
      buttonResp.deferUpdate()
    } catch {
      navigator = await sendMessage.edit(navigator, "", { components: [getButtonRow({ disabled: true, buttons: [{ name:"<--", id:"first" },{ name:"<-", id:"prev" },{ name:`${page+1}`, id:"num", style: "SUCCESS" },{ name:"->", id:"next" },{ name:"-->", id:"last" }]})] })
      page=-1
    }
  }
  return navigator
}

module.exports = { messagePagination }