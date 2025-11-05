import { useEffect, useState } from "react";
import { save, load } from "../../lib/storage";
const KEY = "pomodoro_tasks_v1";

export default function useTasks() {
  const [tasks, setTasks] = useState(load(KEY, []));
  useEffect(() => save(KEY, tasks), [tasks]);

  const add = (title, category = "") =>
    setTasks((t) => [{ id: crypto.randomUUID(), title, category, done: false, totalMs: 0 }, ...t]);
  const remove = (id) => setTasks((t) => t.filter((x) => x.id !== id));
  const toggle = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const rename = (id, title) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, title } : x)));
  const addTime = (id, ms) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, totalMs: (x.totalMs || 0) + ms } : x)));

  return { tasks, add, remove, toggle, rename, addTime };
}
