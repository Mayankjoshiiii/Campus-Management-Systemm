# 🚀 Deployment Guide - Campus Cloud University Management System

This guide explains how to deploy the application to the cloud for free with a live 24/7 URL.

---

## Architecture Overview

In production, the project can run as a **unified full-stack service**:
- The **React frontend** is built into static assets (`frontend/dist`).
- The **Express backend** serves both the API endpoints (`/api/...`) and the React frontend on a single URL/domain.
- A **Cloud MySQL database** (free) stores the relational data.

---

## Step 1: Create a Free Cloud MySQL Database (Takes 2 minutes)

Choose any free cloud MySQL provider:

### Option A: Aiven for MySQL (Recommended - Free Tier)
1. Go to [https://aiven.io/](https://aiven.io/) and create a free account.
2. Click **Create Service** -> select **MySQL** (Free plan).
3. Once created, copy the connection details:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (`avnadmin`)
   - **Password** (given on dashboard)
   - **Database Name** (`defaultdb` or `university`)

### Option B: TiDB Cloud Serverless (Free 25 GB MySQL-compatible)
1. Go to [https://tidbcloud.com/](https://tidbcloud.com/) and sign up for free.
2. Create a **Serverless** cluster.
3. Click **Connect** and choose **Node.js** to view your Host, Port, User, Password, and Database.

---

## Step 2: Initialize & Seed the Cloud Database

On your local machine, open terminal in `backend/` and run:
```bash
# Temporarily set your cloud database variables in backend/.env:
# DB_HOST=your-cloud-host
# DB_USER=your-cloud-user
# DB_PASSWORD=your-cloud-password
# DB_PORT=your-cloud-port
# DB_NAME=your-cloud-dbname

node setup_database.js
node seed_database.js
```
This will automatically create all 15 tables and seed sample Admin, Faculty, Student, and Attendance data in your cloud database!

---

## Step 3: Deploy on Render (1-Click Full-Stack)

1. Go to [https://render.com/](https://render.com/) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your repository: `Mayankjoshiiii/Campus-Management-Systemm`.
4. Configure settings (or Render will read `render.yaml` automatically):
   - **Name**: `campus-management-system`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. In the **Environment Variables** section, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DB_HOST`: *(Your Cloud DB Host)*
   - `DB_USER`: *(Your Cloud DB User)*
   - `DB_PASSWORD`: *(Your Cloud DB Password)*
   - `DB_NAME`: *(Your Cloud DB Name)*
   - `DB_PORT`: *(Your Cloud DB Port, usually 3306)*
   - `JWT_SECRET_KEY`: *(Any random secret string, e.g., `university_mgmt_secret_key_2026`)*
6. Click **Deploy Web Service**.

🎉 Once the deployment finishes, Render will provide you a live URL:
`https://campus-management-system-xxxx.onrender.com`

---

## Alternative: Deploy Frontend on Vercel

If you want to host the frontend separately on Vercel:
1. Go to [https://vercel.com/](https://vercel.com/).
2. Import `Mayankjoshiiii/Campus-Management-Systemm`.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com`
5. Click **Deploy**.
