import { useState } from "react";

function fmtH(ms) {
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  const mm = (m % 60).toString().padStart(2, "0");
  return h ? `${h}h ${mm}m` : `${m}m`;
}

export default function TaskList({ tasks, add, remove, toggle, rename, onSelect }) {
  const [title, setTitle] = useState("");

  return (
    <div className="w-full max-w-md rounded-2xl p-6 shadow-lg bg-white">
      <h3 className="text-lg font-semibold mb-3">Tasks</h3>

      <form className="flex gap-2 mb-4" onSubmit={(e) => {
        e.preventDefault();
        if (title.trim()) { add(title.trim()); setTitle(""); }
      }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task…" className="flex-1 border rounded p-2" />
        <button className="px-3 py-2 rounded-lg bg-black text-white">Add</button>
      </form>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-2 p-2 border rounded">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <input
              className={`flex-1 outline-none ${t.done ? "line-through text-gray-400" : ""}`}
              value={t.title}
              onChange={(e) => rename(t.id, e.target.value)}
            />
            <span className="text-xs text-gray-500">{fmtH(t.totalMs ?? 0)}</span>
            <button onClick={() => onSelect?.(t)} className="text-sm underline">Select</button>
            <button onClick={() => remove(t.id)} className="text-sm text-red-600">Del</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
