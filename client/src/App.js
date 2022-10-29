import React, {useRef,useEffect, useState} from "react";
import ReactDOM from "react-dom";

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const App = () => {
    const [record, setRecord] = useState=([]);
    const videoElement = useRef(null)
    const startBtn = useRef(null)
    const stopBtn = useRef(null)
    // initially it shouldn't start recording
    const Record = useRef(false);
    const modelRef = useRef(null);
    const recordingRef = useRef(false);
    const lastDetections = useRef([])
    const recorderRef = useRef(null)

    useEffect(() => {
        async function inRange() {
            startBtn.current.setAttribute("disabled", true)
            stopBtn.current.setAttribute("disabled", true)
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true
                    });
                    window.stream = stream;
                    videoElement.current.srcObject = stream;
                    const model = await cocoSsd.load();

                    modelRef.current = model;
                    startBtn.current.removeAttribute("disabled");
                } catch(err) {
                    console.log(err);
                }
            }
        }
        inRange();
    }, []);

    async function detect() {
      if(!Record.current) {
        return;
      }

      const predictions = await modelRef.current.detect(videoElement.current);

      let foundAnimal = false;
      for(let i=0; i<predictions.length; i++) {
        if(predictions[i].class === "dog" || predictions[i].class === "cat") {
          foundAnimal = true;
        }
      }
      if(foundAnimal) {
        startRecording();
        lastDetections.current.push(false);
      } else {
        stopRecording();
      }

      lastDetections.current = lastDetections.current.slice(
        Math.max(lastDetections.current.length - 10, 0)
      );

      requestAnimationFrame(() => {
        detect();
      });
    }

    function startRecording() {
      if(recordingRef.current) {
        return;
      }

      recordingRef.current = true;
      console.log("start recording");
      
      recorderRef.current = new MediaRecorder(window.stream);

      recorderRef.current.ondataavailable = function(e) {
        const title = new Date() + "";
        const href = URL.createObjectURL(e.data);
        setRecord(previousRecords => {
          return [...previousRecords, { href, title}];

        });
      }
      recorderRef.current.start();
    }

    function stopRecording() {
      if(!recordingRef.current) {
        return;
      }

      recordingRef.current = false;
      recorderRef.current.stop();
      console.log("stopped recording");
      lastDetections.current= [];
    }

    return(
        <div>
          <div>
            <video autoPlay playsInline muted ref={videoElement} />
          </div>
          <div>
            <button onClick={() => {
              Record.current = true;
              stopBtn.current.removeAttribute("disabled");
              startBtn.current.setAttribute("disabled", true);
              detect();
            }} ref={startBtn}>Start</button>
            <div>
              <button
              onClick={() => {
                Record.current = false;
                startBtn.current.removeAttribute("disabled");
                stopBtn.current.setAttribute("disabled", true);
                stopRecording();
              }}
              >
                Stop
              </button>
            </div>
            <div>
              {!record.length
              ? null
              : record.map(records => {
                return(
                  <div className="card mt-3 w-100" key={records.title}>
                    <div className="card-body">
                      <h5 className="card-title">{records.title}</h5>
                      <video controls src={records.href}></video>
                    </div>
                  </div>
                )
              })
            }
            </div>
          </div>
        </div>
    )

}

export default App;