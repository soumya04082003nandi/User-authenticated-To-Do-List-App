
# 📝 ToDo App (MERN Stack)

A full-stack ToDo application built using **Node.js**, **Express**, **MongoDB Atlas**, and **EJS** for templating. It supports user registration, login, and task management — all wrapped inside a Dockerized container for easy deployment and scalability.

---

## 🚀 Features

- 🧾 User authentication
- ✅ Create, update, delete tasks
- 🕒 Due date and priority support
- 📦 Connected to MongoDB Atlas
- 🐳 Fully Dockerized for local and cloud deployment

---

## 📁 Folder Structure

```
ToDoApp/
│
├── config/               # MongoDB connection logic
├── controllers/          # Route controller logic
├── models/               # Mongoose schemas
├── routes/               # Express route handlers
├── views/                # EJS templates
├── public/               # Static files (CSS/JS)
├── .env                  # MongoDB Atlas credentials (not pushed)
├── Dockerfile            # Docker build instructions
├── .dockerignore         # Files to ignore when building Docker image
├── docker-compose.yml    # Multi-service container definition
├── package.json          # App metadata and scripts
└── index.js              # Main server entry point
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ToDoApp.git
cd ToDoApp
```

### 2. Set Up `.env`

Create a `.env` file in the root directory:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
```

> ⚠️ Replace with your actual MongoDB Atlas credentials.

---

## 🐳 Running with Docker

### Build and Run

```bash
docker-compose up --build
```

### Access the App

Once the container starts, visit:

```
http://localhost:3000
```

> You should see your ToDo app running with MongoDB Atlas as the backend.

---

## 🧼 Docker Cleanup

To stop and remove the container:

```bash
docker-compose down
```

---

## 🚧 Development Notes

- Uses `process.env.MONGODB_URL` for DB connection
- Default port is `3000`
- Docker image uses `node:18`
- `.env` file is **not committed** for security

---

## 📜 License

MIT License — feel free to fork and use for learning or your own projects!

---

## 🙌 Acknowledgements

Built with ❤️ and dedication  by [Soumya Nandi](https://github.com/your-username)
