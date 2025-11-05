// Utilities to transform session docs -> chart-friendly series

// sessions: [{ mode:"work", duration: 25, taskName:"X", date:new Date(...) }, ...]
export function toLast7DaysBars(sessions) {
  const map = new Map(); // key YYYY-MM-DD -> minutes
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - i);
    map.set(d.toISOString().slice(0,10), 0);
  }
  sessions
    .filter(s => s.mode === "work")
    .forEach(s => {
      const d = new Date(s.date || s.createdAt);
      d.setHours(0,0,0,0);
      const k = d.toISOString().slice(0,10);
      if (map.has(k)) map.set(k, (map.get(k) || 0) + (s.duration || 0));
    });
  const labels = [...map.keys()];
  const data = [...map.values()];
  return { labels, data };
}

export function toTopTasksPie(sessions, topN = 5) {
  const byTask = {};
  sessions
    .filter(s => s.mode === "work")
    .forEach(s => {
      const key = s.taskName || "Untitled";
      byTask[key] = (byTask[key] || 0) + (s.duration || 0);
    });
  const entries = Object.entries(byTask).sort((a,b)=>b[1]-a[1]).slice(0, topN);
  return {
    labels: entries.map(([k]) => k),
    data: entries.map(([,v]) => v),
  };
}

export function currentStreakDays(sessions) {
  const days = new Set(
    sessions
      .filter(s => s.mode === "work")
      .map(s => {
        const d = new Date(s.date || s.createdAt);
        d.setHours(0,0,0,0);
        return d.toISOString().slice(0,10);
      })
  );
  let streak = 0;
  const d = new Date();
  d.setHours(0,0,0,0);
  while (days.has(d.toISOString().slice(0,10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function todayMinutes(sessions) {
  const today = new Date(); today.setHours(0,0,0,0);
  const key = today.toISOString().slice(0,10);
  return sessions
    .filter(s => s.mode === "work")
    .filter(s => {
      const d = new Date(s.date || s.createdAt);
      d.setHours(0,0,0,0);
      return d.toISOString().slice(0,10) === key;
    })
    .reduce((sum,s)=>sum+(s.duration||0),0);
}
