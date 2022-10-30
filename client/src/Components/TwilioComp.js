import React, {Component} from "react"

class About extends Component {
    state = {
        text: {
          recipient: '',
          textmessage: '',
          texternumber: '',
        }
      }   
      sendText = _ => {
        const { text } = this.state;
        //pass text message GET variables via query string
        fetch(`http://127.0.0.1:4000/send-text?recipient=${+13608001829}&textmessage=${text.textmessage}%0A&texternumber=${text.texternumber}%0A&texterCompany=${text.texterCompany}%0A&floorArea=${text.floorArea}%0A&cleanType=${text.cleanType}%0A&location=${text.location}%0A&service=${text.service}`)
          .catch(err => console.error(err))
      }
}