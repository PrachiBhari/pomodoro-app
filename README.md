# ⏱️ Pomodoro Productivity App (MERN Stack)

Boost your focus and productivity with the **Pomodoro App**, a full-stack time-management and task-tracking web application built using **MongoDB, Express, React, and Node.js**.  
This app helps you organize tasks, track Pomodoro sessions, and maintain consistent work habits — all in a clean, minimal interface.


## 🚀 Live Demo

🌐 **Frontend (Netlify): ** https://pomodoro-app-p.netlify.app
⚙️ **Backend (Render): ** https://pomodoro-app-b934.onrender.com

---

## 🧠 Features

- 🔐 **JWT Authentication** — secure login and register system  
- 🧾 **Task Management** — create, update, and delete daily tasks  
- ⏰ **Pomodoro Timer** — manage your focus and break intervals  
- 📊 **Session Tracking** — monitor completed focus sessions  
- 💾 **Persistent Data** — MongoDB Atlas for cloud storage  
- 🧩 **Responsive UI** — TailwindCSS for modern design  
- ☁️ **Deployed Full-Stack** — Render (backend) + Netlify (frontend)

---

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- ⚡ Axios for REST API calls

**Backend**
- 🧠 Node.js + Express
- 🗄️ MongoDB + Mongoose
- 🔑 JSON Web Tokens (JWT)
- 🧩 dotenv + CORS

**Deployment**
- 🚀 Netlify — React frontend  
- ⚙️ Render — Express backend  
- ☁️ MongoDB Atlas — cloud database

---

## ⚙️ Project Structure
pomodoro-app/
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── App.js
│ ├── package.json
│ └── tailwind.config.js
│
├── server/ # Express Backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── config/db.js
│ ├── server.js
│ └── package.json
│
└── README.md
🌐 Deployment

Frontend: Deployed on Netlify

Backend: Deployed on Render

Database: Hosted on MongoDB Atlas

🖼️ Screenshots
Home Page & Timer Page
<img width="1899" height="801" alt="image" src="https://github.com/user-attachments/assets/6aec9b43-4038-46d5-a730-9a299159c8af" />

Task Page
<img width="1916" height="858" alt="image" src="https://github.com/user-attachments/assets/1cf5a2b6-da38-4e2e-a78b-306fc72bc257" />

Stats Page
<img width="1893" height="854" alt="image" src="https://github.com/user-attachments/assets/2ad3fd90-6bd5-44de-b194-7efe5843a8d1" />
<img width="1893" height="865" alt="image" src="https://github.com/user-attachments/assets/a0614030-e972-4ccc-a9d6-f01fd4b9e3eb" />
Settings Page
<img width="1913" height="869" alt="image" src="https://github.com/user-attachments/assets/a56ab715-ea71-43e7-8eed-03ca3cc73474" />



🧩 API Routes Overview
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	User login
GET	/api/sessions	Fetch all sessions
POST	/api/sessions	Add a session record
DELETE	/api/sessions/:id	Delete session by ID

