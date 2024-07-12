import { useEffect, useRef, useState } from "react";
import "./App.css";
import Length from "./Length";

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const intervalRef = useRef(null);
  const breakAudio = useRef(new Audio("./assets/breakTime.mp3"));
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type == "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    if (timerOn) {
      clearInterval(intervalRef.current);
      setTimerOn(false);
    } else {
      intervalRef.current = setInterval(() => {
        setDisplayTime((prev) => {
          if (prev <= 0) {
            if (onBreak) {
              clearInterval(intervalRef.current); // Stop timer if on break
              return 0; // Stop at 0
            } else {
              setOnBreak(true); // Switch to break
              playBreakSound(); // Start beeping for break time
              return breakTime; // Set display to break time
            }
          }
          return prev - 1; // Decrease timer
        });
      }, 1000); // Update every second
      setTimerOn(true);
    }
  };

  useEffect(() => {
    if (onBreak) {
      const beepInterval = setInterval(() => {
        playBreakSound(); // Play beep sound repeatedly during break
      }, 1000); // Adjust the interval duration as needed

      return () => clearInterval(beepInterval); // Clear interval on unmount
    }
  }, [onBreak]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };
  return (
    <>
      <div className="center-align">
        <h1>Pomodoro Clock</h1>
        <div className="dual-container">
          <Length
            title={"break length"}
            changeTime={changeTime}
            type={"break"}
            time={breakTime}
            formatTime={formatTime}
          />
          <Length
            title={"session length"}
            changeTime={changeTime}
            type={"session"}
            time={sessionTime}
            formatTime={formatTime}
          />
        </div>
        <h1>{formatTime(displayTime)}</h1>
        <button
          className="btn-large deep-purple lighten-2"
          onClick={controlTime}
        >
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>
        <button className="btn-large deep-purple lighten-2" onClick={resetTime}>
          <i className="material-icons">autorenew</i>
        </button>
      </div>
    </>
  );
}

export default App;
