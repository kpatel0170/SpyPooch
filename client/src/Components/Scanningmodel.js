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

    useRef(() => {
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
        prepare();
    }, [])

    return(
        <div>
            <video autoPlay playsInline muted ref={videoElement} />
        </div>
    )

}