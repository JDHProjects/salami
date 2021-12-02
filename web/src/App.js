import React from "react";
import logo from './logo.png';
import './App.css';

class App extends React.Component{
  
  render(){
    const handleServerAdd = () => {
      window.open('https://discord.com/oauth2/authorize?client_id=637400095821660180&permissions=294205451328&scope=bot', 'newwindow', 'width=500,height=650')
      return false
    }

    const handleGithub = () => {
      window.open('https://github.com/JDHProjects/salami', '_blank')
      return false
    }

    return (
      <div className="App">
        <div className="top-logo-and-text">
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
  
          </div>
          <img src={logo} className="App-logo" alt="logo" />
        
        </div>
      </div>
    )
  }
}

export default App;