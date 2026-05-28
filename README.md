# Research Paper Tracker

A full-stack web application for academics and researchers to manage, track, and analyze research papers efficiently.

## Live Demo

Frontend Deployment: https://research-paper-tracker-blond.vercel.app/

Backend API: https://research-paper-tracker-c01m.onrender.com


---

# Features

## Research Paper Management

* Add research papers
* Delete papers
* Persistent MongoDB storage
* Responsive UI

## Paper Fields

Each paper includes:

* Paper Title
* First Author Name
* Research Domain
* Reading Stage
* Citation Count
* Impact Score
* Date Added

## Research Domains

* Computer Science
* Biology
* Physics
* Chemistry
* Mathematics
* Social Sciences

## Reading Stages

* Abstract Read
* Introduction Done
* Methodology Done
* Results Analyzed
* Fully Read
* Notes Completed

## Advanced Filtering

* Filter by Reading Stage
* Filter by Research Domain
* Filter by Impact Score
* Filter by Date Range

## Analytics Dashboard

* Funnel chart by Reading Stage
* Scatter plot for Citation Count vs Impact Score
* Stacked bar chart by Domain and Reading Stage
* Summary metrics and completion rate

## UI Features

* Dark / Light mode
* Responsive layout
* Material UI design
* Interactive charts with Recharts

---

# Tech Stack

## Frontend

* React
* TypeScript
* Material UI
* Recharts

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# Project Structure

```bash
research-paper-tracker/
│
├── client/          # React frontend
│
├── server/          # Express backend
│
└── README.md
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/parbhatSharma/research-paper-tracker.git
```

---

# Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
MONGO_URI=mongodb+srv://admin:admin1234567890@cluster0.sbeping.mongodb.net/?appName=Cluster0
PORT=8000
```

Run backend:

```bash
node server.js
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# API Endpoints

## Get Papers

```http
GET /api/papers
```

## Add Paper

```http
POST /api/papers
```

## Delete Paper

```http
DELETE /api/papers/:id
```

## Analytics

```http
GET /api/papers/analytics
```

---

# Analytics Included

## Funnel Chart

Displays paper count at each reading stage.

## Scatter Plot

Shows citation count grouped by impact score.

## Stacked Bar Chart

Displays papers by domain and reading stage.

## Summary Metrics

* Papers by reading stage
* Average citations per domain
* Completion rate

---

# Author

Parbhat Sharma
