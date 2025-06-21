import { useState, useEffect } from "react";

// Custom hook for handling a countdown timer
const useTimer = (totalMinutes) => {
  const [minutes, setMinutes] = useState(totalMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Start the timer
  const startTimer = () => {
    setIsRunning(true);
  };

  // Reset the timer (called when totalMinutes changes)
  const resetTimer = () => {
    setMinutes(totalMinutes);
    setSeconds(0);
    setIsTimeUp(false);
    setIsRunning(false); // Stop the timer until manually started
  };

  // Timer countdown logic
  useEffect(() => {
    let timerInterval = null;

    if (isRunning && !isTimeUp) {
      timerInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else if (minutes > 0 && seconds === 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else if (minutes === 0 && seconds === 0) {
          setIsTimeUp(true);
          setIsRunning(false); // Stop the timer when time is up
          clearInterval(timerInterval);
        }
      }, 1000); // Decrease every second
    }

    return () => clearInterval(timerInterval); // Cleanup interval on unmount or reset
  }, [minutes, seconds, isRunning, isTimeUp]);

  return { minutes, seconds, isTimeUp, resetTimer, startTimer };
};

export default useTimer;
