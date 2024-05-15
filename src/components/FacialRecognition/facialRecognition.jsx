import * as faceapi from "face-api.js";
import React from "react";
import "./styles.css";

function FacialRecognition() {
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);
  const [referenceData, setReferenceData] = React.useState({
    descriptor: null,
    name: "",
  });
  const [matchInfo, setMatchInfo] = React.useState({
    isMatch: false,
    distance: null,
  });

  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;

  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const handleVideoOnPlay = () => {
    const intervalId = setInterval(async () => {
      if (canvasRef.current) {
        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0 && referenceData.descriptor) {
          detections.forEach((detection) => {
            const distance = faceapi.euclideanDistance(
              detection.descriptor,
              referenceData.descriptor
            );
            if (distance < 0.6) {
              setMatchInfo({ isMatch: true, distance });
            } else {
              setMatchInfo({ isMatch: false, distance: null });
            }
          });
        }

        //faceapi.draw.drawDetections(canvasRef.current, detections);       //draw detections
        //faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);  //draw landmarks
      }
    }, 1);
    return () => clearInterval(intervalId);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const image = await faceapi.bufferToImage(file);
    const detection = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (detection) {
      setReferenceData({
        descriptor: detection.descriptor,
        name: "Identified Person",
      });
    }
  };

  return (
    <>
      <div>
        <input type="file" onChange={handleImageChange} />
        <div style={{ textAlign: "center", padding: "10px" }}>
          {captureVideo && modelsLoaded ? (
            <button
              onClick={() => {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
                setCaptureVideo(false);
              }}
              style={{
                cursor: "pointer",
                backgroundColor: "green",
                color: "white",
                padding: "15px",
                fontSize: "25px",
                border: "none",
                borderRadius: "10px",
              }}
            >
              Close Webcam
            </button>
          ) : (
            <button
              onClick={startVideo}
              style={{
                cursor: "pointer",
                backgroundColor: "green",
                color: "white",
                padding: "15px",
                fontSize: "25px",
                border: "none",
                borderRadius: "10px",
              }}
            >
              Open Webcam
            </button>
          )}
        </div>
        {captureVideo && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <video
              ref={videoRef}
              height={videoHeight}
              width={videoWidth}
              onPlay={handleVideoOnPlay}
              style={{ borderRadius: "10px" }}
            />
            <canvas ref={canvasRef} style={{ position: "absolute" }} />
          </div>
        )}
      </div>
      <div className="div-results">
        {matchInfo.isMatch && (
          <p className="results">{`Match Found! Distance: ${matchInfo.distance.toFixed(
            2
          )}`}</p>
        )}
      </div>
    </>
  );
}

export default FacialRecognition;
