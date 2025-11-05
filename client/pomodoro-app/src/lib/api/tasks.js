import api from "./apiClient";

export const fetchTasks   = () => api.get("/tasks").then(r => r.data);
export const createTask   = (payload) => api.post("/tasks", payload).then(r => r.data);
export const updateTask   = (id, patch) => api.patch(`/tasks/${id}`, patch).then(r => r.data);
export const deleteTask   = (id) => api.delete(`/tasks/${id}`).then(r => r.data);
export const incTaskTime  = (id, ms) => api.post(`/tasks/${id}/inc-time`, { ms }).then(r => r.data);
