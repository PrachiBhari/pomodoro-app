// import { useEffect, useState } from "react";
// import { Plus, Trash2, Edit2, CheckCircle2, CirclePlay } from "lucide-react";
// import { v4 as uuidv4 } from "uuid";

// export default function TasksPage({ activeTask, setActiveTask }) {
//   const [tasks, setTasks] = useState(() => {
//     const saved = localStorage.getItem("tasks");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [newTask, setNewTask] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   // persist to localStorage
//   useEffect(() => {
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//   }, [tasks]);

//   const addTask = (e) => {
//     e.preventDefault();
//     if (!newTask.trim()) return;
//     setTasks([
//       ...tasks,
//       { id: uuidv4(), title: newTask.trim(), status: "pending", totalMs: 0 },
//     ]);
//     setNewTask("");
//   };

//   const deleteTask = (id) => {
//     setTasks(tasks.filter((t) => t.id !== id));
//     if (activeTask?.id === id) setActiveTask(null);
//   };

//   const toggleStatus = (id) => {
//     setTasks(
//       tasks.map((t) =>
//         t.id === id ? { ...t, status: t.status === "pending" ? "completed" : "pending" } : t
//       )
//     );
//   };

//   const startEdit = (id, title) => {
//     setEditingId(id);
//     setEditTitle(title);
//   };

//   const saveEdit = (id) => {
//     setTasks(tasks.map((t) => (t.id === id ? { ...t, title: editTitle } : t)));
//     setEditingId(null);
//   };

//   const handleSelectForFocus = (task) => {
//     setActiveTask(task);
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

//       {/* --- Add Task Form --- */}
//       <form onSubmit={addTask} className="flex gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Add a new task..."
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           className="flex-1 border rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
//         >
//           <Plus size={18} /> Add
//         </button>
//       </form>

//       {/* --- Task List --- */}
//       {tasks.length === 0 ? (
//         <p className="text-gray-500 dark:text-gray-400 text-center">No tasks yet. Add one!</p>
//       ) : (
//         <ul className="space-y-3">
//           {tasks.map((task) => (
//             <li
//               key={task.id}
//               className={`flex justify-between items-center p-3 rounded-lg shadow-sm border ${
//                 task.status === "completed"
//                   ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700"
//                   : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => toggleStatus(task.id)}
//                   className="text-green-600 dark:text-green-400"
//                 >
//                   {task.status === "completed" ? (
//                     <CheckCircle2 size={22} />
//                   ) : (
//                     <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
//                   )}
//                 </button>

//                 {editingId === task.id ? (
//                   <input
//                     value={editTitle}
//                     onChange={(e) => setEditTitle(e.target.value)}
//                     className="border rounded p-1 bg-gray-50 dark:bg-gray-900"
//                   />
//                 ) : (
//                   <span
//                     className={`${
//                       task.status === "completed"
//                         ? "line-through text-gray-500"
//                         : "text-gray-800 dark:text-gray-200"
//                     }`}
//                   >
//                     {task.title}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center gap-3">
//                 {editingId === task.id ? (
//                   <button
//                     onClick={() => saveEdit(task.id)}
//                     className="text-blue-500 hover:text-blue-600"
//                   >
//                     Save
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => startEdit(task.id, task.title)}
//                     className="text-gray-500 hover:text-blue-500"
//                   >
//                     <Edit2 size={18} />
//                   </button>
//                 )}

//                 <button
//                   onClick={() => handleSelectForFocus(task)}
//                   className={`text-indigo-500 hover:text-indigo-600 ${
//                     activeTask?.id === task.id ? "font-semibold underline" : ""
//                   }`}
//                 >
//                   <CirclePlay size={18} />
//                 </button>

//                 <button
//                   onClick={() => deleteTask(task.id)}
//                   className="text-red-500 hover:text-red-600"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }




import { useState } from "react";
import { useTasks } from "../context/TasksContext";
import { showNotification } from "../features/timer/notify";
import { Play, Trash2 } from "lucide-react";

/**
 * Tasks list with:
 * - Add task
 * - Inline rename (controlled input)
 * - Toggle done
 * - Delete
 * - Select task (click row or play button)
 */
export default function TasksPage() {
  const {
    tasks,
    activeTaskId,
    addTask,
    updateTask,
    deleteTask,
    toggleDone,     // exposed by your TasksContext
    selectTask,     // exposed by your TasksContext
  } = useTasks();

  const [newTitle, setNewTitle] = useState("");

  const add = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    addTask(title);
    setNewTitle("");
  };

  const onSelect = async (task) => {
    selectTask(task.id);

    // optional desktop notification
    try {
      if ("Notification" in window && Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
      showNotification("Task selected", `Current task: ${task.title}`);
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

      {/* Add task */}
      <form onSubmit={add} className="flex gap-3 mb-6">
        <input
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
          placeholder="Add a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          type="submit"
        >
          + Add
        </button>
      </form>

      {/* List */}
      <ul className="space-y-3">
        {tasks.map((t) => {
          const selected = t.id === activeTaskId;
          return (
            <li
              key={t.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(t)} // click anywhere selects
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(t)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition
                ${selected
                  ? "border-green-500 ring-1 ring-green-500/30 bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-gray-900/20"}`}
            >
              {/* left: done toggle + title (editable) */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.status === "done"}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleDone(t.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />

                <input
                  className="bg-transparent outline-none w-[16rem] sm:w-[22rem]"
                  value={t.title}
                  onChange={(e) => updateTask(t.id, { title: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* right: actions */}
              <div className="flex items-center gap-2">
                {/* explicit select (same as row click) */}
                <button
                  title="Select for timer"
                  className="p-2 rounded hover:bg-white/10 text-blue-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(t);
                  }}
                >
                  <Play size={16} />
                </button>

                <button
                  title="Delete"
                  className="p-2 rounded hover:bg-white/10 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(t.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
