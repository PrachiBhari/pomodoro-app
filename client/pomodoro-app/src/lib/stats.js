// src/lib/stats.js
export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDayKey(date) {
  const d = startOfDay(date);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getLast7Days() {
  const days = [];
  const today = startOfDay(new Date());
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

export function aggregateWeekly(sessions) {
  // only count WORK minutes
  const byDay = {};
  sessions
    .filter((s) => s.mode === "work")
    .forEach((s) => {
      const key = formatDayKey(s.date || s.createdAt);
      byDay[key] = (byDay[key] || 0) + (s.duration || 0);
    });

  const labels = getLast7Days();
  return labels.map((d) => {
    const key = formatDayKey(d);
    return { date: key, minutes: byDay[key] || 0 };
  });
}

export function todaySummary(sessions) {
  const todayKey = formatDayKey(new Date());
  const todayWork = sessions
    .filter((s) => s.mode === "work" && formatDayKey(s.date || s.createdAt) === todayKey)
    .reduce((sum, s) => sum + (s.duration || 0), 0);
  const count = sessions.filter((s) => formatDayKey(s.date || s.createdAt) === todayKey).length;
  return { minutes: todayWork, count };
}

export function computeStreak(sessions) {
  // streak of consecutive days with at least one WORK session
  const set = new Set(
    sessions
      .filter((s) => s.mode === "work")
      .map((s) => formatDayKey(s.date || s.createdAt))
  );
  let streak = 0;
  let d = startOfDay(new Date());
  // count backward while the day exists in the set
  while (set.has(formatDayKey(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  // also compute best streak (optional enhancement later)
  return { currentStreak: streak };
}
