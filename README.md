<div align="center">
  <a href="https://www.projexa.haranck.online/">
    <img src="https://img.shields.io/badge/Projexa-Project%20Management-blue?style=for-the-badge&logo=react" alt="Projexa Logo">
  </a>
  <h1 align="center">Projexa</h1>
  <p align="center">
    <strong>A Next-Generation Project Management & Collaboration Platform</strong>
    <br />
    <a href="https://www.projexa.haranck.online/">View Demo</a>
    ·
    <a href="https://github.com/haranck/projexa/issues">Report Bug</a>
    ·
    <a href="https://github.com/haranck/projexa/issues">Request Feature</a>
  </p>
</div>

---

## 🌟 About The Project

Projexa is an advanced, full-stack project management and collaboration platform designed to streamline team workflows, enhance communication, and boost productivity. 

Built as a **real-world SaaS-style application**, it focuses on scalability, clean architecture, and modern development practices—similar to tools like Jira, Notion, and ClickUp.

**Live Demo:** [https://www.projexa.haranck.online/](https://www.projexa.haranck.online/)

### ✨ Core Features

- **🔐 Authentication:** Secure User authentication & authorization.
- **🏢 Workspaces:** Workspace-based project and role management.
- **📊 Kanban Boards:** Drag-and-drop task management using `@dnd-kit`.
- **💬 Real-time Collaboration:** Instant updates and team communication powered by `Socket.IO`.
- **📹 Integrated Video Meetings:** Seamless team meetings via Jitsi integration.
- **🤖 AI Capabilities:** Smart task summarization and assistance using OpenAI and Google Generative AI.
- **📈 Analytics & Reporting:** Interactive charts and project insights with `Recharts`.
- **💳 Premium Features:** Subscription and billing management via Stripe.
- **☁️ Cloud Storage:** Secure file attachments and storage using AWS S3.

---

## 💻 Tech Stack

Projexa leverages a powerful, modern technology stack.

### Frontend
- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Radix UI Primitives
- **State Management:** Redux Toolkit, RTK Query
- **Forms & Validation:** React Hook Form, Zod
- **Drag & Drop:** dnd-kit

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Caching & Queues:** Redis, BullMQ
- **Real-time:** Socket.IO
- **Architecture:** Clean Architecture with Dependency Injection (`tsyringe`)

### External Services
- AWS S3 (Storage)
- Stripe (Payments)
- OpenAI & Google Gemini (AI Integration)
- Jitsi (Video Conferencing)

---

## 🧠 Architecture Highlights

- **Clean Architecture** with SOLID Principles.
- Clear separation of concerns and Domain-driven design principles.
- Use cases for business logic and Interface-based repositories.
- Framework-independent core logic.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB
- Redis

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/haranck/projexa.git
   cd projexa/project_management
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

Create a `.env` file in the **backend** folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_url
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
S3_BUCKET_NAME=your_bucket_name
STRIPE_SECRET_KEY=your_stripe_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

Create a `.env` in the **frontend** folder similarly based on required vars.

### Running Locally

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend application**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Project Structure

```text
projexa/
├── project_management/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── application/    # Use cases and interfaces
│   │   │   ├── domain/         # Entities and domain logic
│   │   │   ├── infrastructure/ # External services, DB schemas
│   │   │   ├── presentation/   # Routes, Controllers, Middleware
│   │   │   └── server.ts       # App entry point
│   │   └── package.json
│   │
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Application views
│   │   │   ├── store/          # Redux setup and slices
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   └── App.tsx         # Root component
│   │   └── package.json
```

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

This project is licensed under the **MIT License**. See `LICENSE` for more information.

---

## 👤 Author

**Haran**  
🔗 GitHub: [https://github.com/haranck](https://github.com/haranck)

---

<div align="center">
  <p>If you like this project, consider giving it a ⭐ on GitHub!</p>
</div>
