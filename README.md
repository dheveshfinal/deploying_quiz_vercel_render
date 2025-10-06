# Interactive Quiz Management System - Deployment Guide

This guide explains how to deploy the **Interactive Quiz Management System** with a backend on **Render** and frontend on **Vercel**, using **PostgreSQL** as the database.

---

## Table of Contents

- [Backend Deployment (Render)](#backend-deployment-render)  
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)  
- [Environment Variables](#environment-variables)  
- [Running the Project Locally](#running-the-project-locally)  

---

## Backend Deployment (Render)

1. **Sign up / Log in** to [Render](https://render.com/).  

2. **Create a new Web Service**:  
   - Connect your GitHub repository.  
   - Set the root directory to `backend/`.  

3. **Configure Environment Variables**:  
   - `DATABASE_URL` → Render provides this when you create a PostgreSQL instance. Example:  
     ```
     postgres://username:password@host:port/dbname
     ```  
   - `PORT` → Leave empty or set to `8000`. Render automatically uses the correct port.  

4. **Deployment Settings**:  
   - Build Command: `npm install`  
   - Start Command: `npm start`  

5. **Database Initialization**:  
   - The backend code automatically creates tables (`users`, `quiz`, `question`, `quiz_option`, `user_answer`, `result`) and triggers for scoring.  

6. **Access Backend**:  
   - Once deployed, Render provides a URL like:  
     ```
     https://your-backend-service.onrender.com
     ```

---

## Frontend Deployment (Vercel)

1. **Sign up / Log in** to [Vercel](https://vercel.com/).  

2. **Import Frontend Repository**:  
   - Connect your GitHub repository.  
   - Set the root directory to `frontend/`.  

3. **Configure Environment Variable**:  
   - `REACT_APP_API_URL` → Set to your Render backend URL. Example:  
     ```
     REACT_APP_API_URL=https://your-backend-service.onrender.com
     ```

4. **Deployment Settings**:  
   - Vercel automatically detects React and runs:  
     ```
     npm install
     npm run build
     ```
   - Then deploys the frontend.  

5. **Access Frontend**:  
   - Vercel provides a URL like:  
     ```
     https://your-frontend.vercel.app
     ```

---

## Environment Variables

- **Backend (`backend/.env`)**:  

DATABASE_URL=postgres://username:password@host:port/dbname
PORT=8000


 **Frontend (`frontend/.env`)**:

 REACT_APP_API_URL=https://your-backend-service.onrender.com

 
**Note:**  
- Render automatically provides a PostgreSQL database connection URL.  
- React environment variables must start with `REACT_APP_`.

---

## Running the Project Locally

1. **Backend**:  
```bash
cd backend
npm install
npm start

Runs at http://localhost:8000

Frontend:
cd frontend
npm install
npm start

Runs at http://localhost:3000

Communicates with the backend using REACT_APP_API_URL=http://localhost:8000

Summary

Render → Hosts the backend and PostgreSQL.

Vercel → Hosts the frontend.

Environment variables ensure secure communication and database connectivity.

Deployment is fully automated once configured.


This version is **deployment-focused**, explaining **Render backend, PostgreSQL, Vercel frontend, environment variables, and running locally**.  

I can also make a **visual deployment diagram showing backend ↔ database ↔ frontend** if you want it to be extra clear.  

Do you want me to add that diagram?
