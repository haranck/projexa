<div align="center">

  <img src="https://img.shields.io/badge/Status-Active%20Development-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Version-1.0.0-purple?style=for-the-badge" alt="Version" />

  <br />
  <br />

  <a href="https://www.projexa.haranck.online/">
    <h1 align="center">🚀 Projexa</h1>
  </a>

  <p align="center">
    <strong>A Next-Generation Project Management & Collaboration Platform</strong>
    <br />
    <br />
    <a href="https://www.projexa.haranck.online/"><b>Live Demo</b></a>
    ·
    <a href="https://github.com/haranck/projexa/issues"><b>Report Bug</b></a>
    ·
    <a href="https://github.com/haranck/projexa/issues"><b>Request Feature</b></a>
  </p>

  <br />

  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  </div>
</div>

---

## 🌟 About The Project

**Projexa** is an advanced, enterprise-grade project management and real-time collaboration platform designed to streamline team workflows, enhance communication, and boost overall productivity. 

Built as a **real-world SaaS-style application**, it focuses on scalability, clean architecture, and modern development practices—similar to industry-leading tools like Jira, Notion, and ClickUp.

> **Explore the Live App:** [https://www.projexa.haranck.online/](https://www.projexa.haranck.online/)

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure User authentication & authorization with JWT. |
| 🏢 **Workspaces** | Complete workspace-based project and team role management. |
| 📊 **Kanban Boards** | Interactive, drag-and-drop task management powered by `@dnd-kit`. |
| 💬 **Real-time Collaboration** | Instant updates, messaging, and activity logs via `Socket.IO`. |
| 📹 **Integrated Meetings** | Seamless team video meetings utilizing Jitsi integration. |
| 🤖 **AI Capabilities** | Smart task summarization and assistance using **OpenAI** and **Google Generative AI**. |
| 📈 **Analytics & Reporting** | Interactive charts and deep project insights rendered with `Recharts`. |
| 💳 **Premium Subscriptions** | Automated subscription and billing lifecycle management via **Stripe**. |
| ☁️ **Cloud Storage** | Secure, scalable file attachments and storage handled by **AWS S3**. |

---

## 💻 Tech Stack & Architecture

Projexa leverages a powerful, meticulously selected modern technology stack to ensure top-tier performance and exceptional user experience.

### 🎨 Frontend
- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Radix UI Primitives
- **State Management:** Redux Toolkit, RTK Query
- **Forms & Validation:** React Hook Form, Zod

### ⚙️ Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Caching & Queues:** Redis, BullMQ
- **Architecture:** Clean Architecture, Dependency Injection (`tsyringe`), SOLID Principles

### 🔌 External Services & Integrations
- **AWS S3:** Scalable cloud storage
- **Stripe:** Payment & subscription gateway
- **OpenAI & Google Gemini:** Artificial Intelligence processing
- **Jitsi:** Video conferencing infrastructure

---

## 🚀 Getting Started

Follow these instructions to set up your local development environment.

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (running locally or via Atlas)
- Redis

### Installation & Setup

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

### Environment Configuration

Create a `.env` file in the **backend** directory:

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

### Running Locally

Open two separate terminal windows/tabs:

**Terminal 1: Backend**
```bash
cd backend
npm run dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

> **Note:** Open your browser and navigate to `http://localhost:5173` to view the application.

---

## 🎯 Why Projexa?

Projexa is not just a demo project — it is a **portfolio-defining application** that demonstrates:
- **Real-world system design** handling complex domain logic.
- **Clean Architecture** in practice with strict separation of concerns.
- **Scalable backend development** using queues (BullMQ) and caching (Redis).
- **Modern frontend patterns** with real-time UI updates.
- **Production-ready engineering** suitable for scalable SaaS deployments.

---

## 🤝 Contributing

Contributions make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Haran**  
🔗 **GitHub:** [https://github.com/haranck](https://github.com/haranck)

---

<div align="center">
  <p>If you like this project, consider giving it a ⭐ on GitHub!</p>
  <p>Built with ❤️ by Haran</p>
</div>
