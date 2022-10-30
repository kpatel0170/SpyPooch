import {Component} from "react"

class About extends Component {
   state = {
    text: {
      recipient: '',
      textmessage: '',
    }
  }   
  sendText = () => {
    // const { text } = this.state;
    //pass text message GET variables via query string
    fetch(`http://localhost:4000/send-text?recipient=${+16395712428}&textmessage="Attention!%20your%20dog%20just%20went%20out"%0A`)
      .catch(err => console.error(err))
  }
   render() {
    return (
      <p onLoad={this.sendText}></p>
    )
   }   
}

export default About;