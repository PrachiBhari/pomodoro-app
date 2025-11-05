import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchTasks, createTask as apiCreate, updateTask as apiUpdate, deleteTask as apiDelete, incTaskTime as apiInc } from "../lib/api/tasks";


const TasksContext = createContext(null);
const KEY = "pomodoro_tasks_v1";

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  const [activeTaskId, setActiveTaskId] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY + "_active")) || null; } catch { return null; }
  });

  useEffect(() => {
  // load from server on first run
  fetchTasks()
    .then(serverTasks => {
      setTasks(serverTasks);                 // replace local list with server list
      // keep activeTaskId if it still exists
      if (activeTaskId && !serverTasks.find(t => t.id === activeTaskId || t._id === activeTaskId)) {
        setActiveTaskId(null);
      }
    })
    .catch(() => {});                        // fail silently; local list remains
}, []);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(KEY + "_active", JSON.stringify(activeTaskId)); }, [activeTaskId]);

  const activeTask = useMemo(
    () => tasks.find(t => t.id === activeTaskId) || null,
    [tasks, activeTaskId]
  );

  //  addTask:
const addTask = async (title, category = "", status = "todo") => {
  const created = await apiCreate({ title, category, status });
  setTasks(prev => [created, ...prev]);
  return created;
};

 const updateTask = async (id, patch) => {
  setTasks(prev => prev.map(t => (t.id || t._id) === id ? { ...t, ...patch } : t));
  try { await apiUpdate(id, patch); } catch { /* optionally revert */ }
};

const deleteTask = async (id) => {
  setTasks(prev => prev.filter(t => (t.id || t._id) !== id));
  if (activeTaskId === id) setActiveTaskId(null);
  try { await apiDelete(id); } catch { /* optionally restore */ }
};

  const toggleDone   = (id) => updateTask(id, { status: (tasks.find(t => t.id === id)?.status === "done") ? "todo" : "done" });

  const selectTask   = (id) => setActiveTaskId(id);
  
 const incrementTime = async (id, ms) => {
  setTasks(prev => prev.map(t => (t.id || t._id) === id ? { ...t, totalMs: (t.totalMs || 0) + ms } : t));
  try { await apiInc(id, ms); } catch { /* ignore */ }
};

  return (
    <TasksContext.Provider value={{
      tasks, activeTask, activeTaskId,
      addTask, updateTask, deleteTask, toggleDone, selectTask, incrementTime
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);
