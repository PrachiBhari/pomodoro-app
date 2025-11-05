import { useState } from "react";
import { loginUser } from "../lib/api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const user = await loginUser(form);
      login(user);
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
      <h2 className="text-2xl font-semibold mb-4">Log in</h2>
      {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
          placeholder="Email" type="email"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
          placeholder="Password" type="password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <button disabled={loading}
          className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-500">
        New here? <Link to="/register" className="text-blue-600">Create an account</Link>
      </p>
    </div>
  );
}
