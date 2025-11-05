import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement, CategoryScale, LinearScale, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler,
} from "chart.js";
import {
  toLast7DaysBars,
  toTopTasksPie,
  currentStreakDays,
  todayMinutes,
} from "../lib/statsChart";
import { chartTheme } from "../lib/chartTheme";
import api from "../lib/api/apiClient";

ChartJS.register(
  BarElement, CategoryScale, LinearScale, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler
);

export default function StatsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const { text, grid } = chartTheme();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get("/sessions")
      .then((res) => {
        if (!alive) return;
        const data = (res.data || []).map((s) => ({
          ...s,
          date: s.date ? new Date(s.date) : new Date(s.createdAt),
        }));
        setSessions(data);
      })
      .catch((e) => setErr(e.response?.data?.message || e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // ---- aggregations ----
  const week = toLast7DaysBars(sessions);
  const today = todayMinutes(sessions);
  const streak = currentStreakDays(sessions);

  const barData = {
    labels: week.labels,
    datasets: [
      {
        label: "Focus (min)",
        data: week.data,
        backgroundColor: "rgba(59,130,246,0.75)", // blue-500/75
        borderRadius: 6,
      },
    ],
  };
  const barOptions = {
    maintainAspectRatio: false,
    layout: { padding: 8 },
    plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
    scales: {
      x: { ticks: { color: text, maxRotation: 0 }, grid: { display: false, drawBorder: false } },
      y: { ticks: { color: text }, grid: { color: grid, drawBorder: false }, beginAtZero: true },
    },
  };

  const lineData = {
    labels: week.labels,
    datasets: [
      {
        label: "Productivity Trend",
        data: cumulative(week.data),
        fill: true,
        backgroundColor: "rgba(16,185,129,0.20)", // emerald/20
        borderColor: "rgba(16,185,129,1)",        // emerald
        pointRadius: 2,
        tension: 0.4,
      },
    ],
  };
  const lineOptions = {
    maintainAspectRatio: false,
    layout: { padding: 8 },
    plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
    scales: {
      x: { ticks: { color: text }, grid: { display: false, drawBorder: false } },
      y: { ticks: { color: text }, grid: { color: grid, drawBorder: false }, beginAtZero: true },
    },
  };

  const topTasks = toTopTasksPie(sessions);
  const pieData = {
    labels: topTasks.labels,
    datasets: [
      {
        data: topTasks.data,
        backgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };
  const pieOptions = {
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: text, boxWidth: 14, usePointStyle: true, pointStyle: "rectRounded" },
      },
      tooltip: { callbacks: { label: (c) => `${c.label}: ${c.formattedValue}m` } },
    },
  };

  // ---- UI states ----
  if (loading) return <div className="py-16 text-center">Loading stats…</div>;
  if (err)
    return (
      <div className="py-4 px-5 rounded-xl bg-red-50 text-red-700 max-w-xl mx-auto">
        Failed to load stats: {err}
      </div>
    );

  const weekTotal = week.data.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 transition-all duration-500">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        Your Focus Analytics 📊
      </h2>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KpiCard
          title="Today's Focus"
          value={`${today}m`}
          subtitle="Total work time"
          gradient="from-blue-500 to-indigo-500"
        />
        <KpiCard
          title="Current Streak"
          value={`${streak} days`}
          subtitle="Consecutive focus days"
          gradient="from-green-400 to-emerald-500"
        />
        <KpiCard
          title="Weekly Total"
          value={`${weekTotal}m`}
          subtitle="Last 7 days"
          gradient="from-fuchsia-500 to-pink-500"
        />
      </div>

      {/* charts */}
      <ChartCard title="Focus Minutes (Last 7 Days)">
        <Bar data={barData} options={barOptions} />
      </ChartCard>

      <ChartCard title="Productivity Trend">
        <Line data={lineData} options={lineOptions} />
      </ChartCard>

      <ChartCard title="Top Tasks by Time">
        <div className="mx-auto max-w-[420px] sm:max-w-[520px] h-[280px] sm:h-[320px]">
          {topTasks.data.length ? (
            <Doughnut data={pieData} options={pieOptions} />
          ) : (
            <div className="h-full grid place-items-center text-sm text-gray-500 dark:text-gray-400">
              No work sessions yet to rank tasks.
            </div>
          )}
        </div>
      </ChartCard>
    </div>
  );
}

/* -- UI helpers -- */
function KpiCard({ title, value, subtitle, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 shadow-sm ring-1 ring-gray-200/60 dark:ring-white/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15 dark:opacity-20`} />
      <div className="relative">
        <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
        <h3 className="text-4xl font-bold mt-1 text-gray-900 dark:text-gray-100">{value}</h3>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900/60 ring-1 ring-gray-200/60 dark:ring-white/10 shadow-sm p-5">
      <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h3>
      <div className="h-72 sm:h-80">{children}</div>
    </div>
  );
}

/* -- small utils -- */
function cumulative(arr) {
  let s = 0;
  return arr.map((v) => (s += v));
}
