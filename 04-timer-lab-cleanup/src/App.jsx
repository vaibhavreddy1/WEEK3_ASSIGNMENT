import { useEffect, useState } from "react";
import "./App.css";
 
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
 
  return `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
 
  useEffect(() => {
    if (!running) {
      return;
    }
 
    const intervalId = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);
 
    return () => {
      clearInterval(intervalId);
    };
  }, [running]);
 
  const reset = () => {
    setRunning(false);
    setSeconds(0);
  };
 
  return (
    <div className="timer-card">
      <div className="timer-card-header">
        <div>
          <p className="eyebrow">Mode 01</p>
          <h2>Stopwatch</h2>
        </div>
 
        <span className={`status ${running ? "active" : ""}`}>
          {running ? "Running" : "Paused"}
        </span>
      </div>
 
      <div className="timer-display">
        {formatTime(seconds)}
      </div>
 
      <div className="timer-actions">
        {!running ? (
          <button
            className="primary-button"
            onClick={() => setRunning(true)}
          >
            Start
          </button>
        ) : (
          <button
            className="secondary-button"
            onClick={() => setRunning(false)}
          >
            Pause
          </button>
        )}
 
        <button
          className="secondary-button"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Countdown() {
  const [minutesInput, setMinutesInput] = useState("5");
  const [secondsInput, setSecondsInput] = useState("0");
 
  const [remainingSeconds, setRemainingSeconds] =
    useState(300);
 
  const [running, setRunning] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
 
  useEffect(() => {
    if (!running) {
      return;
    }
 
    if (remainingSeconds <= 0) {
      setRunning(false);
      setTimeUp(true);
      return;
    }
 
    const intervalId = setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          return 0;
        }
 
        return currentSeconds - 1;
      });
    }, 1000);
 
    return () => {
      clearInterval(intervalId);
    };
  }, [running, remainingSeconds]);
 
  const updateFromInputs = () => {
    const minutes = Math.max(
      0,
      Number.parseInt(minutesInput, 10) || 0
    );
 
    const seconds = Math.min(
      59,
      Math.max(
        0,
        Number.parseInt(secondsInput, 10) || 0
      )
    );
 
    setMinutesInput(String(minutes));
    setSecondsInput(String(seconds));
 
    setRemainingSeconds(minutes * 60 + seconds);
    setTimeUp(false);
  };
 
  const start = () => {
    if (remainingSeconds <= 0) {
      updateFromInputs();
    }
 
    setTimeUp(false);
    setRunning(true);
  };
 
  const reset = () => {
    setRunning(false);
    setTimeUp(false);
 
    const minutes =
      Number.parseInt(minutesInput, 10) || 0;
 
    const seconds =
      Number.parseInt(secondsInput, 10) || 0;
 
    setRemainingSeconds(minutes * 60 + seconds);
  };
 
  return (
    <div className="timer-card">
      <div className="timer-card-header">
        <div>
          <p className="eyebrow">Mode 02</p>
          <h2>Countdown</h2>
        </div>
 
        <span
          className={`status ${
            running ? "active" : ""
          } ${timeUp ? "finished" : ""}`}
        >
          {timeUp
            ? "Time's up"
            : running
            ? "Running"
            : "Paused"}
        </span>
      </div>
 
      <div className="countdown-inputs">
        <div>
          <label>Minutes</label>
 
          <input
            type="number"
            min="0"
            value={minutesInput}
            disabled={running}
            onChange={(event) =>
              setMinutesInput(event.target.value)
            }
            onBlur={updateFromInputs}
          />
        </div>
 
        <span>:</span>
 
        <div>
          <label>Seconds</label>
 
          <input
            type="number"
            min="0"
            max="59"
            value={secondsInput}
            disabled={running}
            onChange={(event) =>
              setSecondsInput(event.target.value)
            }
            onBlur={updateFromInputs}
          />
        </div>
      </div>
 
      <div className="timer-display">
        {formatTime(remainingSeconds)}
      </div>
 
      <div className="timer-actions">
        {!running ? (
          <button
            className="primary-button"
            onClick={start}
          >
            {remainingSeconds === 0
              ? "Start"
              : "Resume"}
          </button>
        ) : (
          <button
            className="secondary-button"
            onClick={() => setRunning(false)}
          >
            Pause
          </button>
        )}
 
        <button
          className="secondary-button"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Pomodoro() {
  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
 
  const [phase, setPhase] = useState("focus");
  const [remainingSeconds, setRemainingSeconds] =
    useState(FOCUS_TIME);
 
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(1);
 
  useEffect(() => {
    if (!running) {
      return;
    }
 
    if (remainingSeconds <= 0) {
      if (phase === "focus") {
        setPhase("break");
        setRemainingSeconds(BREAK_TIME);
      } else {
        setPhase("focus");
        setRemainingSeconds(FOCUS_TIME);
        setCycle((currentCycle) => currentCycle + 1);
      }
 
      return;
    }
 
    const intervalId = setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          return 0;
        }
 
        return currentSeconds - 1;
      });
    }, 1000);
 
    return () => {
      clearInterval(intervalId);
    };
  }, [
    running,
    remainingSeconds,
    phase,
  ]);
 
  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setRemainingSeconds(FOCUS_TIME);
    setCycle(1);
  };
 
  return (
    <div className="timer-card pomodoro-card">
      <div className="timer-card-header">
        <div>
          <p className="eyebrow">Mode 03</p>
          <h2>Pomodoro</h2>
        </div>
 
        <span
          className={`phase-badge ${
            phase === "focus"
              ? "focus"
              : "break"
          }`}
        >
          {phase === "focus"
            ? "Focus"
            : "Break"}
        </span>
      </div>
 
      <div className="pomodoro-cycle">
        Cycle {cycle}
      </div>
 
      <div className="timer-display">
        {formatTime(remainingSeconds)}
      </div>
 
      <p className="phase-text">
        {phase === "focus"
          ? "Stay focused and get your work done."
          : "Take a short break and recharge."}
      </p>
 
      <div className="timer-actions">
        {!running ? (
          <button
            className="primary-button"
            onClick={() => setRunning(true)}
          >
            Start
          </button>
        ) : (
          <button
            className="secondary-button"
            onClick={() => setRunning(false)}
          >
            Pause
          </button>
        )}
 
        <button
          className="secondary-button"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] =
    useState("stopwatch");
 
  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">
            React · useEffect · setInterval
          </p>
 
          <h1>Timer Lab</h1>
 
          <p className="subtitle">
            Three timers. One important rule: every
            interval must be cleaned up correctly.
          </p>
        </div>
      </header>
 
      <nav className="tabs">
        <button
          className={
            activeTab === "stopwatch"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("stopwatch")
          }
        >
          Stopwatch
        </button>
 
        <button
          className={
            activeTab === "countdown"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("countdown")
          }
        >
          Countdown
        </button>
 
        <button
          className={
            activeTab === "pomodoro"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("pomodoro")
          }
        >
          Pomodoro
        </button>
      </nav>
 
      <main className="timer-container">
        {activeTab === "stopwatch" && (
          <Stopwatch />
        )}
 
        {activeTab === "countdown" && (
          <Countdown />
        )}
 
        {activeTab === "pomodoro" && (
          <Pomodoro />
        )}
      </main>
 
      <section className="cleanup-note">
        <span className="cleanup-icon">✓</span>
 
        <div>
          <strong>Cleanup enabled</strong>
 
          <p>
            Every timer clears its interval when it
            pauses, switches state, or unmounts.
          </p>
        </div>
      </section>
    </div>
  );
}
 
export default App;
 