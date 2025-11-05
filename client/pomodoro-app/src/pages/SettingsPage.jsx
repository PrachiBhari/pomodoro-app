import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    sound: true,
    notifications: true,
  });

  // Load saved settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : parseFloat(value),
    });
  };

  const handleReset = () => {
    localStorage.removeItem("settings");
    setSettings({
      work: 25,
      shortBreak: 5,
      longBreak: 15,
      sound: true,
      notifications: true,
    });
    alert("Preferences reset to default ✅");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Settings ⚙️</h2>

      {/* Theme */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Theme</h3>
          <ThemeToggle />
        </div>
      </section>

      {/* Timer Durations */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-3">
        <h3 className="font-medium mb-2">Default Durations (minutes)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm">Work</label>
            <input
              name="work"
              type="number"
              min="1"
              value={settings.work}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="text-sm">Short Break</label>
            <input
              name="shortBreak"
              type="number"
              min="1"
              value={settings.shortBreak}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="text-sm">Long Break</label>
            <input
              name="longBreak"
              type="number"
              min="1"
              value={settings.longBreak}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Sound & Notification */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-3">
        <h3 className="font-medium mb-2">Preferences</h3>

        <div className="flex items-center justify-between">
          <span>Play sound when timer ends</span>
          <input
            type="checkbox"
            name="sound"
            checked={settings.sound}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Show desktop notification</span>
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-500"
          />
        </div>
      </section>

      {/* Reset Button */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Reset All Preferences
        </button>
      </section>
    </div>
  );
}
