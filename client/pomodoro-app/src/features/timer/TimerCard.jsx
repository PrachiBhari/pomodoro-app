import { useEffect, useMemo, useRef } from "react";
import useTimer from "./useTimer";

function fmt(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Props:
 * onUserInteract()
 * onWorkComplete(durationMs)
 * onBreakComplete(durationMs)
 * onModeChange(mode)
 */
export default function TimerCard({ onUserInteract, onWorkComplete, onBreakComplete, onModeChange }) {
  const { mode, remaining, isRunning, durations, start, pause, reset, toggleMode, setCustomDurations } = useTimer();

  const total = mode === "work" ? durations.work : durations.shortBreak; // seconds
  const progress = useMemo(() => {
    const done = Math.max(0, total - remaining);
    return Math.min(1, done / (total || 1));
  }, [total, remaining]);

  useEffect(() => { onModeChange?.(mode); }, [mode, onModeChange]);

  // Fire completion exactly once per phase end
  const notifiedRef = useRef(false);
  useEffect(() => {
    if (!isRunning && remaining === 0 && total > 0 && !notifiedRef.current) {
      notifiedRef.current = true;
      const durationMs = total * 1000;
      if (mode === "work") onWorkComplete?.(durationMs);
      else onBreakComplete?.(durationMs);
      // Do NOT auto-start next phase; just prepare it
      const next = mode === "work" ? "break" : "work";
      reset(next);
      // release the flag after a short moment
      setTimeout(() => { notifiedRef.current = false; }, 150);
    }
  }, [isRunning, remaining, total, mode, onWorkComplete, onBreakComplete, reset]);

  return (
    <div className={`w-full max-w-md rounded-2xl p-6 shadow-lg ${mode === "work" ? "bg-red-50" : "bg-emerald-50"}`}>
      <h2 className="text-xl font-semibold text-center mb-2">{mode === "work" ? "Focus" : "Break"}</h2>

      {/* Progress ring */}
      <div className="flex items-center justify-center my-6">
        <div className="relative grid place-items-center" style={{ width: 220, height: 220 }}>
          <div className="rounded-full" style={{
            width: 220, height: 220,
            background: `conic-gradient(currentColor ${progress * 360}deg, rgba(0,0,0,0.08) 0deg)`,
            color: mode === "work" ? "#ef4444" : "#10b981",
          }} />
          <div className="absolute rounded-full bg-white" style={{ width: 180, height: 180 }} />
          <div className="absolute text-6xl font-bold tabular-nums select-none">{fmt(remaining)}</div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button
            data-test="btn-start"
            onClick={() => { onUserInteract?.(); start(); }}
            className="px-4 py-2 rounded-lg bg-black text-white"
            aria-label="Start timer"
          >Start</button>
        ) : (
          <button
            data-test="btn-pause"
            onClick={pause}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white"
            aria-label="Pause timer"
          >Pause</button>
        )}
        <button data-test="btn-reset" onClick={() => reset()} className="px-4 py-2 rounded-lg border" aria-label="Reset timer">Reset</button>
        <button data-test="btn-toggle" onClick={toggleMode} className="px-4 py-2 rounded-lg border" aria-label="Toggle phase">
          {mode === "work" ? "→ Break" : "→ Work"}
        </button>
      </div>

      <form className="mt-6 grid grid-cols-2 gap-3" onSubmit={(e) => {
        e.preventDefault();
        const work = parseFloat(e.currentTarget.work.value);
        const brk  = parseFloat(e.currentTarget.break.value);
        if (work >= 0.1 && brk >= 0.1) setCustomDurations(work, brk);
      }}>
        <label className="flex flex-col text-sm">
          Work (min)
          <input name="work" type="number" min="0.1" step="0.1" defaultValue={durations.work / 60} className="border rounded p-2" />
        </label>
        <label className="flex flex-col text-sm">
          Break (min)
          <input name="break" type="number" min="0.1" step="0.1" defaultValue={durations.shortBreak / 60} className="border rounded p-2" />
        </label>
        <button className="col-span-2 mt-1 px-3 py-2 rounded-lg border">Save Durations</button>
      </form>
    </div>
  );
}
