import React, { useRef, useEffect, useState } from "react";
import "./Scanningmodel.css"
import Bgimage from "../assets/bg.png"
import Catimg from "../assets/cat.png"

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import TwilioComp from "../Components/TwilioComp"

const App = () => {
  const [records, setRecords] = useState([]);

  const videoElement = useRef(null);
  const startButtonElement = useRef(null);
  const stopButtonElement = useRef(null);

  const shouldRecordRef = useRef(false);
  const modelRef = useRef(null);
  const recordingRef = useRef(false);
  const lastDetectionsRef = useRef([]);
  const recorderRef = useRef(null);

  useEffect(() => {
    async function prepare() {
      startButtonElement.current.setAttribute("disabled", true);
      stopButtonElement.current.setAttribute("disabled", true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
          });
          window.stream = stream;
          videoElement.current.srcObject = stream;
          const model = await cocoSsd.load();

          modelRef.current = model;
          startButtonElement.current.removeAttribute("disabled");
        } catch (error) {
          console.error(error);
        }
      }
    }
    prepare();
  }, []);

  async function detectFrame() {
    if (!shouldRecordRef.current) {
      stopRecording();
      return;
    }

    const predictions = await modelRef.current.detect(videoElement.current);

    let Animal = false;
    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i].class === "dog" || predictions[i].class === "cat") {
        Animal = true;
      }
      console.log(predictions)
    }

    if (Animal) {
      startRecording();
      TwilioComp()
      lastDetectionsRef.current.push(true);
    } else if (lastDetectionsRef.current.filter(Boolean).length) {
      startRecording();
      lastDetectionsRef.current.push(false);
    } else {
      stopRecording();
    }

    lastDetectionsRef.current = lastDetectionsRef.current.slice(
      Math.max(lastDetectionsRef.current.length - 10, 0)
    );

    requestAnimationFrame(() => {
      detectFrame();
    });
  }

  function startRecording() {
    if (recordingRef.current) {
      return;
    }

    recordingRef.current = true;
    console.log("start recording");

    recorderRef.current = new MediaRecorder(window.stream);

    recorderRef.current.ondataavailable = function(e) {
      const title = new Date() + "";
      const href = URL.createObjectURL(e.data);
      setRecords(previousRecords => {
        return [...previousRecords, { href, title }];
      });
    };

    recorderRef.current.start();
  }

  function stopRecording() {
    if (!recordingRef.current) {
      return;
    }

    recordingRef.current = false;
    recorderRef.current.stop();
    console.log("stopped recording");
    lastDetectionsRef.current = [];
  }


  // const state = {
  //   text: {
  //     recipient: '',
  //     textmessage: '',
  //   }
  // }   
  // const sendText = () => {
  //   const { text } = this.state;
  //   //pass text message GET variables via query string
  //   fetch(`http://127.0.0.1:4000/send-text?recipient=${+19897560563}&textmessage="Attention!%20your%20dog%20just%20went%20out"%0A`)
  //     .catch(err => console.error(err))
  // }



  return (
    <div>
      <div className="stream-img">
        <video autoPlay playsInline muted ref={videoElement} />
        <img className="dogImg" src={Bgimage} alt="bgimage"/>
      </div>
      <div>
        <div className="buttons">
          <div>
            <button
              onClick={() => {
                shouldRecordRef.current = true;
                stopButtonElement.current.removeAttribute("disabled");
                startButtonElement.current.setAttribute("disabled", true);
                detectFrame();
              }}
              ref={startButtonElement}
            >
              Start
            </button>
          
          </div>
          <div>
            <button
              onClick={() => {
                shouldRecordRef.current = false;
                startButtonElement.current.removeAttribute("disabled");
                stopButtonElement.current.setAttribute("disabled", true);
                stopRecording();
              }}
              ref={stopButtonElement}
            >
              Stop
            </button>
          </div>
          <div>
          </div>
        </div>
        <div className="recordings">
        <img className="catImg" src={Catimg} alt="cat" />
          <h3>Records:</h3>
          {!records.length
            ? null
            : records.map(record => {
                return (
                  <div className="card mt-3 w-100" key={record.title}>
                    <div className="card-body">
                      <h5 className="card-title">{record.title}</h5>
                      <video controls src={record.href}></video>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default App;