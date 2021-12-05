import React from "react";
import logo from './assets/logo.png';
import salamiName from './assets/salaminame.png';
import salamiImage from './assets/salamiimage.png';
import iconFt from './assets/icons/icon-ft.png';
import iconGamble from './assets/icons/icon-gamble.png';
import iconMoney from './assets/icons/icon-money.png';
import iconSteam from './assets/icons/icon-steam.png';
import iconStocks from './assets/icons/icon-stocks.png';
import iconSword from './assets/icons/icon-sword.png';
import './App.css';
import commands from './assets/commands.json'


class App extends React.Component{
  constructor(props) {
    super(props);

    let now = new Date();
    let tempState = {commandHover: false, messageTime: `${now.getHours() > 9 ? now.getHours() : "0" + now.getHours()}:${now.getMinutes() > 9 ? now.getMinutes() : "0" + now.getMinutes()}`}
    for (const command of commands) {
      if(command.admin !== true){
        tempState[command.name+"Hover"] = false
      }
    }
    this.state = tempState

  }
  
  render(){
    const handleServerAdd = () => {
      window.open('https://discord.com/oauth2/authorize?client_id=637400095821660180&permissions=294205451328&scope=bot', 'newwindow', 'width=500,height=650')
      return false
    }

    const handleGithub = () => {
      window.open('https://github.com/JDHProjects/salami', '_blank')
      return false
    }

    const getAllCommands = () => {
      let commandsList = []
      for (const command of commands) {
        if(command.admin !== true){
          let variableName = command.name+"Hover"
          commandsList.push(
          <div className="command-container">
          <img src={salamiImage} className={this.state[variableName] ? "command-salami-image" : "command-salami-image hidden"} alt="logo"/>
          <p className={this.state[variableName] ? "command-message-time" : "command-message-time hidden"}>Today at: {this.state.messageTime}</p>
          <img src={salamiName} className={this.state[variableName] ? "command-salami-name" : "command-salami-name hidden"} alt="logo"
          onMouseEnter={() => {this.setState({[variableName]: true, commandHover: true})}}
          onMouseLeave={() => {this.setState({[variableName]: false, commandHover: false})}}/>
          <p className={this.state.commandHover ? ( this.state[variableName] ? "command-text" : "command-text command-text-hidden" ) : "command-text"}
                              onMouseEnter={() => {this.setState({[variableName]: true, commandHover: true})}}
                              onMouseLeave={() => {this.setState({[variableName]: false, commandHover: false})}}
                              >{">"+command.name}</p>
          <p className={this.state[variableName] ? "command-text-example" : "command-text-example hidden"}>{command.example}</p>
          <div className={this.state[variableName] ? "command-extra-container" : "command-extra-container hidden"}>
          <p className={"command-extra-title"}>{command.display}</p>
            <div className="command-text-row">
              <p className={"command-extra-name"}>command:</p>
              <p className={"command-extra-info"}>{command.name}</p>
            </div>
            <div className="command-text-row">
              <p className={"command-extra-name"}>Description:</p>
              <p className={"command-extra-info"}>{command.description}</p>
            </div>
            <div className="command-text-row">
              <p className={"command-extra-name"}>Usage:</p>
              <p className={"command-extra-info"}>{command.usage}</p>
            </div>
            <div className="command-text-row">
              <p className={"command-extra-name"}>Example:</p>
              <p className={"command-extra-info"}>{">"+command.name+" "+command.example}</p>
            </div>
          </div>
          </div>)
        }
      }
      return commandsList
    }

    return (
      <div className={(this.state.commandHover ? "App-dark" : "App") + " parallax"}>
          <div class="parallax-layer-base">
            <div className="title-subtitle-container">
              <b className="title-text">
                Salami
              </b>
              <p className="subtitle-text">
                A Discord bot by JDHProjects
              </p>
              <div className="button-container">
                <button className="add-button mouse" onClick={handleServerAdd} styles>Add To Discord</button>
                <button className="add-button mouse" onClick={handleGithub} styles>View On Github</button>
              </div>
              <div className="blurb-container">
                <p className="blurb-text">
                  Trade stocks based on the real market, play DND easier, win free steam games, play minigames and more using Salami!
                </p>
                <div className="blurb-icons-container">
                  <div className="blurb-icons-row">
                    <div className="blurb-icon-container">
                      <div className="icon-background">
                        <img src={iconFt} className="icon" alt="logo" />
                      </div>
                      <p className="icon-text">Generate your own unique FTs</p>
                    </div>
                    <div className="blurb-icon-container">
                      <div className="icon-background">
                        <img src={iconGamble} className="icon" alt="logo" />
                      </div>
                      <p className="icon-text">Gamble your salami using games</p>
                    </div>
                  </div>
                  <div className="blurb-icons-row">
                    <div className="blurb-icon-container">
                      <div className="icon-background">
                        <img src={iconMoney} className="icon" alt="logo" />
                      </div>
                      <p className="icon-text">Earn salami and trade with users</p>
                    </div>
                    <div className="blurb-icon-container">
                      <div className="icon-background">
                        <img src={iconSteam} className="icon" alt="logo" />
                      </div>
                      <p className="icon-text">Trade salami for free Steam games</p>
                    </div>
                  </div>
                  <div className="blurb-icons-row">
                    <div className="blurb-icon-container">
                      <div className="icon-background">
                        <img src={iconStocks} className="icon" alt="logo" />
                      </div>
                      <p className="icon-text">Trade stocks based on the real stock market</p>
                    </div>
                    <div className="blurb-icon-container">
                      <div className="icon-background">
                        <img src={iconSword} className="icon" alt="logo" />
                      </div>
                      <p className="icon-text">Play DND easier than ever before</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {getAllCommands()}
          </div>

          <div class="parallax-layer-back">

            <img src={logo} className="App-logo" alt="logo" />
          </div>
      </div>
    )
  }
}

export default App;