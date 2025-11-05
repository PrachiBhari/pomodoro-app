import { useEffect, useRef, useState } from "react";
import { save, load } from "../../lib/storage";

const DEFAULTS = { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
const KEY = "pomodoro_timer_v1";

export default function useTimer() {
  const [mode, setMode] = useState("work");
  const [durations, setDurations] = useState(DEFAULTS);
  const [remaining, setRemaining] = useState(DEFAULTS.work);
  const [isRunning, setIsRunning] = useState(false);
  const endRef = useRef(null);

  // ✅ 1. Load saved timer state
  useEffect(() => {
    const saved = load(KEY, null);
    if (saved) {
      setMode(saved.mode ?? "work");
      setDurations(saved.durations ?? DEFAULTS);
      setRemaining(saved.remaining ?? DEFAULTS.work);
      setIsRunning(saved.isRunning ?? false);
      endRef.current = saved.endTime ?? null;
    }
  }, []);

  // ✅ 2. Reactively load user settings from localStorage
  useEffect(() => {
    const applySettings = () => {
      const s = JSON.parse(localStorage.getItem("settings") || "{}");
      if (s.work || s.shortBreak) {
        const newDurations = {
          work: (s.work || 25) * 60,
          shortBreak: (s.shortBreak || 5) * 60,
          longBreak: (s.longBreak || 15) * 60,
        };
        setDurations(newDurations);
        if (!isRunning)
          setRemaining(mode === "work" ? newDurations.work : newDurations.shortBreak);
      }
    };

    applySettings();
    window.addEventListener("storage", applySettings);
    return () => window.removeEventListener("storage", applySettings);
  }, [isRunning, mode]);

  // ✅ 3. Persist state
  useEffect(() => {
    save(KEY, { mode, durations, remaining, isRunning, endTime: endRef.current });
  }, [mode, durations, remaining, isRunning]);

  // ✅ 4. Real-time ticking
  useEffect(() => {
    let raf;
    const tick = () => {
      if (!isRunning || !endRef.current) return;
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setIsRunning(false);
        endRef.current = null;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    if (isRunning) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isRunning]);

  // --- core actions ---
  const totalFor = (m) => (m === "work" ? durations.work : durations.shortBreak);

  const start = () => {
    if (isRunning) return;
    endRef.current = Date.now() + remaining * 1000;
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
    setRemaining(left);
    endRef.current = null;
    setIsRunning(false);
  };

  const reset = (nextMode = mode) => {
    setIsRunning(false);
    endRef.current = null;
    setMode(nextMode);
    setRemaining(totalFor(nextMode));
  };

  const toggleMode = () => reset(mode === "work" ? "break" : "work");

  return {
    mode,
    remaining,
    isRunning,
    durations,
    start,
    pause,
    reset,
    toggleMode,
  };
}
