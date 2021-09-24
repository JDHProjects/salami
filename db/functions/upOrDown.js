const upOrDown = async function(up) {
  const { botValues } = require("../db.js")

  let values = await botValues.findByPk("botConnected")
  let timeDown = 0
  if(values.dataValues.value == "false" && up == "true"){
    timeDown = (Date.now() - Date.parse(values.dataValues.updatedAt)) / 1000
  }
  if (values.dataValues.value != up){
    values.update({value:up})
  }
  return timeDown
}

module.exports = { upOrDown }