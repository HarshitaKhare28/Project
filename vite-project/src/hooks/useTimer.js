import { useState, useEffect } from "react";

const useTimer = (totalMinutes) => {
  const [minutes, setMinutes] = useState(totalMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setMinutes(totalMinutes);
    setSeconds(0);
    setIsTimeUp(false);
    setIsRunning(false);
  };

  // 🆕 Update state when totalMinutes prop changes
  useEffect(() => {
    setMinutes(totalMinutes);
    setSeconds(0);
    setIsTimeUp(false);
    setIsRunning(false);
  }, [totalMinutes]);

  useEffect(() => {
    let timerInterval = null;

    if (isRunning && !isTimeUp) {
      timerInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes > 0 && seconds === 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else if (minutes === 0 && seconds === 0) {
          setIsTimeUp(true);
          setIsRunning(false);
          clearInterval(timerInterval);
        }
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [minutes, seconds, isRunning, isTimeUp]);

  return { minutes, seconds, isTimeUp, resetTimer, startTimer };
};

export default useTimer;
