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
    <a href="https://github.com/your-username/projexa/issues">Report Bug</a>
    ·
    <a href="https://github.com/your-username/projexa/issues">Request Feature</a>
  </p>
</div>

---

## 🌟 About The Project

Projexa is an advanced, full-stack project management and collaboration platform designed to streamline team workflows, enhance communication, and boost productivity. 

Built with modern web technologies, Projexa offers real-time collaboration, AI-powered insights, integrated video meetings, and intuitive drag-and-drop task management interfaces.

**Live Demo:** [https://www.projexa.haranck.online/](https://www.projexa.haranck.online/)

### ✨ Key Features

- **📊 Kanban Boards:** Drag-and-drop task management using `@dnd-kit`.
- **💬 Real-time Collaboration:** Instant updates and communication powered by `Socket.IO`.
- **📹 Integrated Video Meetings:** Seamless team meetings via Jitsi integration.
- **🤖 AI Capabilities:** Smart task summarization and assistance using OpenAI and Google Generative AI.
- **📈 Analytics & Reporting:** Interactive charts and project insights with `Recharts`.
- **💳 Premium Features:** Subscription and billing management via Stripe.
- **☁️ Cloud Storage:** Secure file attachments and storage using AWS S3.
- **🔔 Notifications:** Real-time push notifications and automated email alerts.

---

## 💻 Tech Stack

Projexa leverages a powerful, modern technology stack to ensure scalability, performance, and an exceptional user experience.

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
   git clone https://github.com/your-username/projexa.git
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

Create `.env` files in both the frontend and backend directories based on their respective `.env.example` configurations.

**Backend required variables typically include:**
- `PORT`, `MONGODB_URI`, `REDIS_URL`
- `JWT_SECRET`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `S3_BUCKET_NAME`
- `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`

### Running Locally

1. **Start the backend server (Development Mode)**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend application**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

---

## 📁 Project Structure

Projexa follows a modular and clean architecture pattern.

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

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ by the Projexa Team</p>
</div>
