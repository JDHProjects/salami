const transfer = async function(sender, reciever, amount) {
  let absAmount = Math.abs(Math.round(amount))
  if (sender.dataValues.money < absAmount){
    absAmount = sender.dataValues.money
  }
  await reciever.increment("money", {by: absAmount})
  await sender.decrement("money", {by: absAmount})
  return "money transferred"
}

module.exports = { transfer }