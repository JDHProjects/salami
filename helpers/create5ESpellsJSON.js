const request = require("request")
const names = require("../assets/spells/names/names.json")

const create5ESpellsJSON = function() {
  return new Promise(function(resolve, reject) {
    let spellPromises = []
    names.forEach(name => {
      spellPromises.push(getSpellData(name))
    })
    Promise.all(spellPromises)
      .then(resp => {
        const fs = require("fs")
        fs.writeFile("./assets/spells/data/data.json", JSON.stringify(resp, null, 2), err => {
          if (err) {
            console.log(err)
          }
          resolve(`${resp.length} Spells written to JSON`)
        })
      })
      .catch(err => {
        console.log(err)
      })
  })
}

function getSpellData(name) {
  return new Promise(function(resolve, reject) {
    request({url:`https://roll20.net/compendium/dnd5e/${name == "Shield" ? "Spells:Shield" : name }.json`}, function (error, response, body) {
      let spellJson = JSON.parse(body)

      if(spellJson.data.Category == "Spells")
      {
				
        let description = undefined
        let higher_level = undefined

        let cleanContent = spellJson.htmlcontent.replaceAll(/<table>.*<\/table>/g, "Table cannot be displayed, refer to roll20").replaceAll("\n", "").replaceAll("\t", "").replaceAll("<strong>", "**").replaceAll("</strong>", "**").replaceAll("<br>", "\n").replaceAll("\n\n", "\n").replaceAll("  ", " ").replaceAll("<em>", "").replaceAll("</em>", "").replaceAll("&nbsp;", " ").replaceAll("<p>", "").replaceAll("</p>", "\n").replaceAll("<b>", "**").replaceAll("</b>", "**").replaceAll("<i>", "").replaceAll("</i>", "").replaceAll("<span>", "").replaceAll("</span>", "").replaceAll("<ul>", "").replaceAll("</ul>", "").replaceAll("<li>", "•").replaceAll("</li>", "\n").replaceAll("<div>", "").replaceAll("</div>", "")
        if(cleanContent.includes("At Higher Levels: ")){
          let contentSplit = cleanContent.split("At Higher Levels: ")
          description = contentSplit[0]
          higher_level = contentSplit[1]
        }
        else{
          description = cleanContent
        }

        let spell = {
          id: spellJson.id,
          name: spellJson.name,
          level: parseInt(spellJson.data.Level),
          school: spellJson.data.School,
          casting_time: spellJson.data["Casting Time"],
          range: spellJson.data.Range,
          components: spellJson.data.Components,
          materials: spellJson.data.Material,
          duration: spellJson.data.Duration,
          classes: spellJson.data.Classes,
          description: description == undefined ? undefined : description.trim(),
          higher_level: higher_level == undefined ? undefined : higher_level.trim()
        }
        resolve(spell)
      }
      else{
        reject(`${name} is not a spell`)
      }
    })
  })
}


create5ESpellsJSON()
  .then(resp => {
    console.log(resp)
  })