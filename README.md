# Interactive Quiz Management System

A **web-based quiz platform** built with **React.js** for the frontend and **Node.js/Express** for the backend.  
It features an admin panel for managing quizzes, role-based access control, and real-time user performance analytics.

---

## Features

- Admin panel to **add, edit, and delete quiz questions** and options  
- **Role-based access control** for admins and users  
- **User performance tracking** with analytics  
- **Real-time interactive quiz UI**  
- **PostgreSQL** database for storing users, quizzes, and results  

---



## Prerequisites

- Node.js (v14 or above)  
- npm  
- PostgreSQL  

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/dheveshfinal/Interactive-Quiz-Management-System.git
cd Interactive-Quiz-Management-System


2. Backend Setup
cd backend
npm install
npm run dev


Backend runs on: http://localhost:5000 (default)

3. Frontend Setup
cd frontend
npm install
npm start


Frontend runs on: http://localhost:3000 (default)

4. Database Setup

Install PostgreSQL

Create a database (e.g., quiz_system)

Update the backend .env file with your DB credentials:

DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=quiz_system
DB_PORT=5432

use pg.db.text which contain the query for table and trigger
"# deploying_quiz_vercel_render" 
