# 🚀 Airline Voucher Seat Assignment App – Golang Backend + React Frontend

This project is a fullstack web application that includes:

- **🔧 Backend**: Golang
- **🎨 Frontend**: React
- **🐳 Containerization**: Docker + Docker Compose

## ⚙️ How to Run the App

### ✅ Option 1: Run Locally (Without Docker)

#### 🟦 Run the Golang Backend

```bash
cd backend
go mod tidy
go run main.go
```

Backend will start at: http://localhost:8080

#### 🟨 Run the React Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will start at: http://localhost:5173

### 🐳 Option 2: Run with Docker

#### 📦 Build and Start

From the root project directory:

```bash
docker-compose up --build
```

React app: http://localhost:3000
Go API: http://localhost:8080

#### 🛑 Stop the App

```bash
docker-compose down
```
