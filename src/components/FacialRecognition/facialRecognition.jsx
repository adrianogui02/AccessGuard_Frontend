import axios from "axios";
import * as faceapi from "face-api.js";
import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

function FacialRecognition() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [residents, setResidents] = useState([]);
  const [matchInfo, setMatchInfo] = useState({
    isMatch: false,
    distance: null,
    name: "",
    photo: "",
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;

  useEffect(() => {
    const loadModelsAndResidents = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/resident/getAllResidents`
        );
        console.log(response.data);
        const residentDescriptors = await Promise.all(
          response.data.map(async (resident) => {
            const img = await faceapi.fetchImage(resident.foto);
            const detection = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            return {
              id: resident.id,
              name: resident.nome,
              photo: resident.foto,
              descriptor: detection.descriptor,
            };
          })
        );
        setResidents(residentDescriptors);
      } catch (error) {
        console.error("Failed to load residents", error);
      }
    };

    loadModelsAndResidents();
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

  const stopVideo = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setCaptureVideo(false);
    setMatchInfo({
      isMatch: false,
      distance: null,
      name: "",
      photo: "",
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

        if (detections.length > 0) {
          detections.forEach((detection) => {
            const matchedResident = residents.reduce((best, resident) => {
              const distance = faceapi.euclideanDistance(
                detection.descriptor,
                resident.descriptor
              );
              if (
                distance < 0.6 &&
                (best === null || distance < best.distance)
              ) {
                return { resident, distance };
              }
              return best;
            }, null);

            if (matchedResident) {
              setMatchInfo({
                isMatch: true,
                distance: matchedResident.distance,
                name: matchedResident.resident.name,
                photo: matchedResident.resident.photo,
              });
            } else {
              setMatchInfo({
                isMatch: false,
                distance: null,
                name: "Rosto não identificado",
                photo: "",
              });
            }
          });
        } else {
          setMatchInfo({
            isMatch: false,
            distance: null,
            name: "Rosto não identificado",
            photo: "",
          });
        }
      }
    }, 5000);
    return () => clearInterval(intervalId);
  };

  return (
    <>
      <div>
        <div style={{ textAlign: "center", padding: "10px" }}>
          {captureVideo && modelsLoaded ? (
            <button
              className="button-face-recognition-stop"
              onClick={stopVideo}
            >
              Encerrar Captura
            </button>
          ) : (
            <button
              onClick={startVideo}
              className="button-face-recognition-start"
            >
              Iniciar Captura
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
      {captureVideo && (
        <div className="div-results">
          <div
            className={`results-container ${
              matchInfo.isMatch ? "" : "results-container-not-identified"
            }`}
          >
            {matchInfo.isMatch ? (
              <>
                <img
                  src={matchInfo.photo}
                  alt={matchInfo.name}
                  className="results-photo"
                />
                <p className="results">{matchInfo.name}</p>
              </>
            ) : (
              <p className="results-not-identified">Rosto não identificado</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FacialRecognition;
