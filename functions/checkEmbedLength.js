const checkEmbedLength = function(embed, name, content) {
  if(content.length<=1024){
    embed.addField(name, content, false)
  }
  else{
    let splitContent = content.split("\n")
    for (let i in splitContent){
      embed.addField(`${i == 0 ? name : "\u200b"}`, `${splitContent[i]}`, false)
    }
  }
}

module.exports = { checkEmbedLength }