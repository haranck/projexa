# 🚀 Projexa

Projexa is a **collaborative project management platform** designed to help teams plan, track, and manage work efficiently.

It is built as a **real-world SaaS-style application**, focusing on scalability, clean architecture, and modern development practices.

---

## 🌟 Vision

To build a production-ready project management system similar to tools like **Jira, Notion, and ClickUp**, while maintaining clean code, strong architecture, and extensibility.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* JWT Authentication

### Architecture

* Clean Architecture
* SOLID Principles
* Dependency Injection
* Modular & Scalable Design

---

## ✨ Core Features

* 🔐 User authentication & authorization
* 🏢 Workspace-based project management
* 👥 Role & permission management
* 📌 Projects, tasks, and issues tracking
* 💬 Team collaboration & activity logs
* 🔔 Real-time notifications system
* 📅 Meetings & scheduling
* 💳 Subscription & payment handling
* 🛠️ Admin dashboard & controls

---

## 🧠 Architecture Highlights

* Clear separation of concerns
* Domain-driven design principles
* Use cases for business logic
* Interface-based repositories
* Framework-independent core logic

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/haranck/projexa.git
cd projexa
```

---

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 3. Setup Environment Variables

Create a `.env` file in the **backend** folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_url
```

---

### 4. Run the Project

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

---

## 📁 Project Structure

```

projexa/
│
├── backend/
│   ├── src/
│   │   ├── application/
│   │   ├── config/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── presentation/
│   │   ├── shared/
│   │   ├── types/
│   │   └── server.ts
│
├── frontend/
│   ├── src/
│   │   ├── axios/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── public/
│
└── README.md
```

---

## 🚧 Project Status

🚧 In active development

This project is being built step-by-step with a focus on **quality over speed** and real-world engineering practices.

---

## 🎯 Why Projexa?

Projexa is not just a demo project — it is a **portfolio-defining application** that demonstrates:

* Real-world system design
* Clean Architecture in practice
* Scalable backend development
* Modern frontend patterns
* Production-ready thinking

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add your feature"

# Push to the branch
git push origin feature/your-feature
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Haran**
🔗 GitHub: https://github.com/haranck

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
