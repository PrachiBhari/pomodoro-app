// import { useEffect, useMemo, useState } from "react";
// import { Play, Pause, RotateCcw, Coffee, Briefcase } from "lucide-react";
// import useTimer from "../features/timer/useTimer";
// import { playBeep, showNotification } from "../features/timer/notify";
// import api from "../lib/api/apiClient";

// export default function TimerPage({ activeTask, setActiveTask }) {
//   const {
//     mode,
//     remaining,
//     isRunning,
//     durations,
//     start,
//     pause,
//     reset,
//     toggleMode,
//   } = useTimer();

//   // Load user settings from localStorage (fallback to defaults)
// const stored = JSON.parse(localStorage.getItem("settings") || "{}");

// const defaultSettings = {
//   work: stored.work || 25,
//   shortBreak: stored.shortBreak || 5,
//   longBreak: stored.longBreak || 15,
//   sound: stored.sound ?? true,
//   notifications: stored.notifications ?? true,
// };

//   const [session, setSession] = useState(1);
//   const total = mode === "work" ? durations.work : durations.shortBreak;
//   const progress = useMemo(() => ((total - remaining) / total) * 100, [remaining, total]);

//   // Auto-switch logic

// useEffect(() => {
//   // Only run when timer finishes
//   if (!isRunning && remaining === 0) {
//     const durationMin = Number.isFinite(total / 60) ? total / 60 : 0;

//     // 1️⃣ Beep + desktop notification
//     if (defaultSettings.sound) playBeep();

//     if (defaultSettings.notifications) {
//       const nextMsg =
//         mode === "work"
//           ? "Work session complete! Take a short break ☕"
//           : "Break over! Time to focus 💪";
//       showNotification("Pomodoro Timer", nextMsg);
//     }

//     // 2️⃣ Save work session to backend
//     if (mode === "work" && durationMin > 0) {
//       const taskName = activeTask?.title || "Unnamed Task";

//       api
//         .post("/sessions", {
//           taskName,
//           duration: durationMin,
//           mode: "work",
//         })
//         .then((res) => console.log("✅ Session saved:", res.data))
//         .catch((err) => {
//           console.error("❌ Error saving session:", err.response?.data || err.message);
//         });
//     }

//     // 3️⃣ Switch between work and break phases
//     const nextMode = mode === "work" ? "break" : "work";
//     if (mode === "work") setSession((prev) => Math.min(prev + 1, 4));

//     // 4️⃣ Smooth phase transition
//     setTimeout(() => {
//       toggleMode(nextMode);
//     }, 800);
//   }
// }, [isRunning, remaining, mode, toggleMode]);



//   const fmt = (sec) => {
//     const m = Math.floor(sec / 60).toString().padStart(2, "0");
//     const s = (sec % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   return (
//     <div className="flex flex-col items-center justify-center text-center gap-10">
//       {/* Header */}
//       <div className="text-left w-full max-w-lg">
//         <h2 className="text-2xl font-semibold">Pomodoro Timer</h2>
//         <p className="text-gray-600 dark:text-gray-400">
//           {mode === "work" ? "Focus mode — let’s get things done 💪" : "Break mode — relax ☕"}
//         </p>
//       </div>

//       {/* Timer Circle */}
//       <div
//         className={`relative flex flex-col items-center justify-center w-72 h-72 rounded-full p-[6px] shadow-lg transition-all duration-700 ${
//           mode === "work"
//             ? "bg-gradient-to-br from-blue-500 to-purple-600"
//             : "bg-gradient-to-br from-green-400 to-emerald-600"
//         }`}
//       >
//         <div className="absolute inset-[6px] rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="text-5xl font-bold">{fmt(remaining)}</h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
//               {mode === "work" ? "Work Time" : "Break Time"}
//             </p>
//           </div>
//         </div>

//         {/* Progress Ring */}
//         <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
//           <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" />
//           <circle
//             cx="50"
//             cy="50"
//             r="46"
//             stroke="url(#gradient)"
//             strokeWidth="8"
//             fill="none"
//             strokeDasharray="289"
//             strokeDashoffset={289 - (289 * progress) / 100}
//             strokeLinecap="round"
//           />
//           <defs>
//             <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#3b82f6" />
//               <stop offset="100%" stopColor="#8b5cf6" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* Current Timer Settings */}
// {/* Current Timer Settings (safe rendering) */}
// <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
//   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm">
//     🕒 Work: <span className="font-semibold">{Math.max(0, Math.round((durations?.work || 0) / 60))}</span> min
//   </span>
//   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm">
//     ☕ Break: <span className="font-semibold">{Math.max(0, Math.round((durations?.shortBreak || 0) / 60))}</span> min
//   </span>
//   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm">
//     🌿 Long Break: <span className="font-semibold">{Math.max(0, Math.round((durations?.longBreak || 0) / 60))}</span> min
//   </span>
// </div>



//       {/* Controls */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => (isRunning ? pause() : start())}
//           className={`px-8 py-3 rounded-full text-white text-lg font-medium transition-all shadow-lg ${
//             isRunning
//               ? "bg-red-500 hover:bg-red-600 scale-95"
//               : "bg-green-500 hover:bg-green-600 scale-100"
//           }`}
//         >
//           {isRunning ? (
//             <div className="flex items-center gap-2">
//               <Pause size={20} /> Pause
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Play size={20} /> Start
//             </div>
//           )}
//         </button>

//         <button
//           onClick={() => reset()}
//           className="p-3 rounded-full border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
//         >
//           <RotateCcw size={18} />
//         </button>

//         <button
//           onClick={toggleMode}
//           className="p-3 rounded-full border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
//           title="Switch Mode"
//         >
//           {mode === "work" ? <Coffee size={18} /> : <Briefcase size={18} />}
//         </button>
//       </div>

//       {/* Session Counter */}
//       <p className="text-gray-700 dark:text-gray-300 mt-2">
//         Session <span className="font-semibold">{session}</span> / 4
//       </p>

//       {/* Active Task Preview */}
//       {activeTask ? (
//         <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center">
//           <div>
//             <h3 className="font-semibold">Current Task</h3>
//             <p className="text-gray-600 dark:text-gray-400 text-sm">
//               {activeTask.title}
//             </p>
//           </div>
//           <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
//             {Math.floor((activeTask.totalMs || 0) / 60000)} min
//           </span>
//         </div>
//       ) : (
//         <div className="text-gray-500 italic dark:text-gray-400">
//           No active task selected
//         </div>
//       )}

//     </div>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, Coffee, Briefcase } from "lucide-react";
import useTimer from "../features/timer/useTimer";
import { playBeep, showNotification } from "../features/timer/notify";
import { useTasks } from "../context/TasksContext";
import api from "../lib/api/apiClient";

function fmt(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function TimerPage() {
  const { activeTask, incrementTime } = useTasks();

  const {
    mode,             // "work" | "break"
    remaining,        // seconds left
    isRunning,
    durations,        // { work: s, shortBreak: s, longBreak: s }
    start, pause, reset, toggleMode,
  } = useTimer();

  const [session, setSession] = useState(1);
  const total = mode === "work" ? durations.work : durations.shortBreak;
  const progress = useMemo(
    () => (total ? ((total - remaining) / total) * 100 : 0),
    [remaining, total]
  );

  // Auto-switch + notify + persist session
  useEffect(() => {
    if (!isRunning && remaining === 0) {
      // sound + notification
      playBeep();
      showNotification(
        "Pomodoro Timer",
        mode === "work" ? "Work session complete! Take a short break ☕"
                        : "Break over! Time to focus 💪"
      );

      // save session + add time to active task (work only)
      if (mode === "work") {
        const taskName = activeTask?.title || "Unnamed Task";
        const durationMin = (total || 0) / 60;

        if (activeTask) incrementTime(activeTask.id || activeTask._id, total * 1000);

        // send to backend (ignore networking errors silently)
        api.post("/sessions", { taskName, duration: durationMin, mode: "work" })
           .catch(() => {});
      }

      // advance session counter, then toggle phase
      if (mode === "work") setSession((s) => Math.min(s + 1, 4));
      const next = mode === "work" ? "break" : "work";
      setTimeout(() => toggleMode(next), 700);
    }
  }, [isRunning, remaining, mode, total, activeTask, incrementTime, toggleMode]);

  return (
    <div className="flex flex-col items-center justify-center text-center gap-8">
      {/* Header */}
      <div className="text-left w-full max-w-lg">
        <h2 className="text-2xl font-semibold">Pomodoro Timer</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {mode === "work" ? "Focus mode — let’s get things done 💪" : "Break mode — relax ☕"}
        </p>
      </div>

      {/* Timer circle */}
      <div
        className={`relative flex flex-col items-center justify-center w-72 h-72 rounded-full p-[6px] shadow-lg transition-all duration-700 ${
          mode === "work"
            ? "bg-gradient-to-br from-blue-500 to-purple-600"
            : "bg-gradient-to-br from-green-400 to-emerald-600"
        }`}
      >
        <div className="absolute inset-[6px] rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold">{fmt(remaining)}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {mode === "work" ? "Work Time" : "Break Time"}
            </p>
          </div>
        </div>

        {/* Progress ring */}
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray="289"
            strokeDashoffset={289 - (289 * progress) / 100}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>


      {/* Current Timer Settings (safe rendering) */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm">
     🕒 Work: <span className="font-semibold">{Math.max(0, Math.round((durations?.work || 0) / 60))}</span> min
   </span>
   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm">
     ☕ Break: <span className="font-semibold">{Math.max(0, Math.round((durations?.shortBreak || 0) / 60))}</span> min
   </span>
   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm">
     🌿 Long Break: <span className="font-semibold">{Math.max(0, Math.round((durations?.longBreak || 0) / 60))}</span> min
   </span>
 </div>


      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => (isRunning ? pause() : start())}
          className={`px-8 py-3 rounded-full text-white text-lg font-medium transition-all shadow-lg ${
            isRunning ? "bg-red-500 hover:bg-red-600 scale-95" : "bg-green-500 hover:bg-green-600 scale-100"
          }`}
        >
          {isRunning ? (
            <div className="flex items-center gap-2">
              <Pause size={20} /> Pause
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play size={20} /> Start
            </div>
          )}
        </button>

        <button
          onClick={() => reset()}
          className="p-3 rounded-full border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={toggleMode}
          className="p-3 rounded-full border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Switch Mode"
        >
          {mode === "work" ? <Coffee size={18} /> : <Briefcase size={18} />}
        </button>
      </div>

      {/* Session Counter */}
      <p className="text-gray-700 dark:text-gray-300 mt-2">
        Session <span className="font-semibold">{session}</span> / 4
      </p>

      {/* Active Task Preview */}
      {activeTask ? (
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Current Task</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{activeTask.title}</p>
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {Math.floor(((activeTask.totalMs || 0) / 60000))} min
          </span>
        </div>
      ) : (
        <div className="text-gray-500 italic dark:text-gray-400">No active task selected</div>
      )}
    </div>
  );
}
