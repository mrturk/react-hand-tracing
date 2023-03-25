/* eslint-disable no-duplicate-case */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react"
import Handsfree from 'handsfree'
import { Button, Stack, Typography } from "@mui/material"

const handsfree = new Handsfree({
    showDebug: true,
    hands: true,
})
handsfree.plugin.palmPointers.enable()
handsfree.plugin.palmPointers.speed = { x: 2, y: 2 }


const HandTracing = () => {
    let intervalID;
    const [x, setX] = useState(0)
    const [color, setColor] = useState("red")

    const [boxY, setBoxY] = useState(0);
    const [boxX, setBoxX] = useState(600);
    const [started, setStarted] = useState(false);
    const [boxColor, setBoxColor] = useState("blue");
    const [loading, setLoading] = useState(false)
    const [score, setScore] = useState(0)

    const box1Ref = useRef();
    const boardRef = useRef()

    const control = useCallback(() => {
        handControl()
    }, [])

    useEffect(() => {
        control();
        droppedBox();
        return () => clearInterval(intervalID);
    }, [control, started, boxY])



    const handControl = () => {

        handsfree.use('logger', ({ hands }) => {
            if (!hands.pinchState) return
            if (hands.pinchState[0][0] === "held") {
                setColor("red")
            }
            if (hands.pinchState[0][1] === "held") {
                setColor("yellow")
            }
            if (hands.pinchState[0][2] === "held") {
                setColor("black")
            }
            if (hands.pinchState[0][3] === "held") {
                setColor("blue")
            }
            if (!hands.pointer) return
            if (hands.pointer[0]?.isVisible) {
                if (hands.pointer[0].x > 1300) {
                    setX(1300)
                } else if (hands.pointer[0].x < 200) {
                    setX(200)
                } else {
                    setX(hands.pointer[0].x)
                }

            }

        })
    }

    const droppedBox = () => {

        if (started) {
            intervalID = setInterval(() => {
                setBoxY(countInterval => countInterval + 10);
                console.log('box', box1Ref.current?.offsetLeft)
                console.log('board', boardRef.current?.offsetLeft)

                if (boxY > 830) {
                    setBoxY(0)
                    setBoxX(Math.floor(Math.random() * 1000) + 600)
                    if (box1Ref.current?.offsetLeft < boardRef.current?.offsetLeft) {
                        alert("Oyun Başarısız Toplam Puan" + score)
                        clearInterval(intervalID)
                        setStarted(started => started = false)
                        setScore(score => score + 0)
                        window.location.reload();
                    }
                    if ((boardRef.current?.style.cssText === box1Ref.current?.style.cssText)) {
                        setScore(score => score + 1)
                        switch (Math.floor(Math.random() * 4) + 1) {
                            case 1:
                                setBoxColor(boxColor => boxColor = "red")
                                break;
                            case 2:
                                setBoxColor(boxColor => boxColor = "blue")
                                break;
                            case 3:
                                setBoxColor(boxColor => boxColor = "yellow")
                                break;
                            case 4:
                                setBoxColor(boxColor => boxColor = "black")
                                break;
                            default:
                                setBoxColor(boxColor => boxColor = "blue")
                                break;
                        }
                    } else {
                        alert("Oyun Başarısız Toplam Puan" + score)
                        clearInterval(intervalID)
                        setStarted(started => started = false)
                        setScore(score => score + 0)
                        window.location.reload();
                    }
                }

            }, 1);
        } else {
            clearInterval(intervalID);
        }
    }


    return (
        <Stack>
            {loading ? (<Stack minHeight="100vh" flex={1} justifyContent="center" alignItems="center">
                <Typography>LOADING...</Typography>
            </Stack>) : (
                <Stack minHeight="100vh" sx={{ overflow: 'hidden', backgroundImage: `url("https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} flex={1} justifyContent>

                    <Stack sx={{ position: 'relative' }} flex={1} alignItems="center">
                        <Button onClick={async () => {
                            setLoading(true)
                            if (started === true) {
                                handsfree.stop();
                            }
                            else {
                                handsfree.start();
                            }
                            setTimeout(() => {
                                !started ? setStarted(true) : setStarted(false)
                                setLoading(false)
                            }, 7000);

                        }} sx={{ width: '200px' }} variant="contained">{started ? "Reset Game" : "Start Game"}</Button>
                        <Typography color="yellow" variant="h3" sx={{ position: 'absolute', right: "10px" }}>
                            {`Score= ${score}`}
                        </Typography>

                    </Stack>
                    {started && <Stack ref={box1Ref} style={{ backgroundColor: boxColor }} sx={{ borderRadius: '50%', width: '50px', height: '50px', position: 'absolute', top: `${boxY}px`, left: `${boxX}px` }} />}
                    {started && <Stack ref={boardRef} style={{ backgroundColor: color, }} sx={{ borderRadius: '20px', width: '500px', height: '20px', position: 'absolute', left: `${x.toString()}px`, bottom: `20px` }} />}
                </Stack>
            )}
        </Stack>
    )

}
export default HandTracing