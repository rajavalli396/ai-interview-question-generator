# AI Interview Preparation Website

Full-stack AI interview practice app using React, Tailwind CSS, Spring Boot, MySQL, JWT authentication, and Google Gemini.

## Structure

- `frontend` - Vite React app with React Router, Axios, Tailwind CSS, protected pages, interview flow, and history UI.
- `backend` - Spring Boot API with Spring Security, JWT, Spring Data JPA, MySQL persistence, and Gemini integration.

## Backend Setup

1. Create a MySQL database or let the JDBC URL create it:

   ```sql
   CREATE DATABASE ai_interview_prep;
   ```

2. Configure environment variables using `backend/.env.example` as a guide:

   ```text
   DB_URL=jdbc:mysql://localhost:3306/ai_interview_prep?createDatabaseIfNotExist=true
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=replace-with-a-very-long-secret-at-least-32-characters
   GEMINI_API_KEY=your_google_gemini_api_key
   FRONTEND_ORIGIN=http://localhost:5173
   ```

3. Run the API:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

## Frontend Setup

1. Configure `frontend/.env` from `frontend/.env.example`.
2. Install and run:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/interviews/generate`
- `POST /api/interviews/evaluate`
- `POST /api/ai/generate`
- `GET /api/history`
- `GET /api/history/{id}`
- `DELETE /api/history/{id}`

## Flow

Register or log in, open the dashboard, start an interview, select role, experience, difficulty, and question count, answer generated questions, submit for Gemini evaluation, and review saved results later.
