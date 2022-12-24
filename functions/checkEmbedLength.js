const checkEmbedLength = function(embed, name, content) {
  if(content.length<=1024){
    embed.addFields({name:name, value:content, inline:false})
  }
  else{
    let splitContent = content.split("\n").filter(text => text != "")
    for (let i in splitContent){
      embed.addFields({name:`${i == 0 ? name : "\u200b"}`, value:`${splitContent[i]}`, inline:false})
    }
  }
}

module.exports = { checkEmbedLength }