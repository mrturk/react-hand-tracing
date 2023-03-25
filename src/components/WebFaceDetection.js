import Webcam from 'react-webcam';
import { useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { useCallback, useEffect } from 'react';
import axios from 'axios';

const WebFaceDetection = () => {
    const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
        faceDetectionOptions: {
            model: 'short',
        },
        faceDetection: new FaceDetection.FaceDetection({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        }),
        camera: ({ mediaSrc, onFrame, width, height }) =>
            new Camera(mediaSrc, {
                onFrame,
                width,
                height,
            }),
    });

    const moving = useCallback(async () => {
        console.log(boundingBox.map(async (item, index) => {
            if (item.xCenter > 0.2) {
                await axios.get("https://localhost:7245/api/Values?type=1");
            } else {
                await axios.get("https://localhost:7245/api/Values?type=0");
            }
        }))
    }, [boundingBox])

    useEffect(() => {
        moving();
    }, [moving])


    return (
        <div>
            <p>{`Loading: ${isLoading}`}</p>
            <p>{`Face Detected: ${detected}`}</p>
            <p>{`Number of faces detected: ${facesDetected}`}</p>
            <div style={{ width: '100%', height: '500px', position: 'relative' }}>
                {boundingBox.map((box, index) => (
                    <div
                        key={`${index + 1}`}
                        style={{
                            border: '4px solid red',
                            position: 'absolute',
                            top: `${box.yCenter * 100}%`,
                            left: `${box.xCenter * 100}%`,
                            width: `${box.width * 100}%`,
                            height: `${box.height * 100}%`,
                            zIndex: 1,
                        }}
                    />
                ))}
                <Webcam
                    ref={webcamRef}
                    forceScreenshotSourceSize
                    style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                    }}
                />
            </div>
        </div>
    );
};

export default WebFaceDetection;