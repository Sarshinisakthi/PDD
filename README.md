# LifeLink - Smart Health Monitoring System

Complete Full-Stack Web Application for tracking user vitals and managing health data.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Recharts, Context API
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Auth

## Project Structure
- `/frontend` - React application
- `/backend`  - Express API

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally on default port 27017)

## Setup Instructions

### 1. Backend Setup
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```

Make sure your MongoDB service is running locally on `mongodb://127.0.0.1:27017`.
Start the backend server:
```bash
npm run dev
```
*(The server will run on port 5000)*

**Seed Doctors Data (Optional but recommended):**
To populate the doctors list, open a new terminal and run:
```bash
curl -X POST http://localhost:5000/api/doctors/seed
```

### 2. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*(The frontend will run on port 5173)*

### 3. Usage Guide
1. Open `http://localhost:5173` in your browser.
2. **Register** a new account and **Log in**.
3. Go to the **Device Connection** page from the sidebar and click "Start Simulation".
4. Navigate to the **Dashboard** to view real-time incoming health data and live charts!
5. Check the **Alerts** tab if vitals go out of normal ranges.
