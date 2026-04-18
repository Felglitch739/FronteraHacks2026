# 🧠 AI Fitness Assistant (Working Name)

> An empathetic AI-powered fitness assistant that adapts your training and recovery based on how you feel every day.

---

## 🎯 Project Goal

Build a web application that helps users **train smarter, not harder**.

Unlike traditional fitness apps that follow rigid plans, this app:

- Listens to how the user feels daily
- Adapts workouts dynamically
- Prevents overtraining
- Encourages long-term health

---

## 💡 Core Concept

The app works in **two layers**:

### 1. 🗓️ Weekly Plan (Static AI-generated baseline)

- Generated based on user goal:
    - `bulk`
    - `cut`
    - `maintain`
- Defines what the user _should_ do each day

### 2. ⚡ Daily Adaptation (Dynamic AI adjustment)

- Based on:
    - Sleep
    - Stress
    - Muscle soreness
- Adjusts the daily workout in real-time

---

## 🔥 MVP Features

### 🔐 Authentication

- User registration & login
- Each user has a fitness goal

### 🗓️ Weekly Plan Generator

- AI generates a 7-day workout structure
- Stored as JSON in database

### 📋 Daily Check-in

User inputs:

- Sleep hours
- Stress level (1–10)
- Muscle soreness (1–10)

### 🧠 AI Daily Recommendation

Returns:

- Readiness score (0–100)
- Adjusted workout
- Short empathetic message
- Nutrition tip

### 📊 Dashboard

Displays:

- Readiness Score
- Planned vs Adjusted workout
- Exercise list
- Nutrition tip

---

## 🧱 Tech Stack

### Backend

- Laravel
- Inertia.js

### Frontend

- React (TypeScript)
- TailwindCSS (Dark Mode)

### Database

- MySQL

### AI Integration

- OpenAI / Claude API

---

## 🗄️ Database Structure (Simplified)

### users

- id
- name
- email
- goal (bulk, cut, maintain)

### weekly_plans

- id
- user_id
- plan_json

### daily_logs

- id
- user_id
- sleep_hours
- stress_level
- soreness

### recommendations

- id
- user_id
- daily_log_id
- readiness_score
- planned
- adjusted
- workout_json
- nutrition_tip

---

## 🔁 Application Flow

1. User registers and selects goal
2. Weekly plan is generated (AI)
3. Each day:
    - User completes check-in
    - AI evaluates condition
    - Workout is adapted
4. Dashboard displays results

---

## ⚠️ MVP Constraints

### ❌ Not included

- Editable workout plans
- Complex nutrition tracking
- Social features
- Real-time chat
- Wearable integrations

### ✅ Included

- AI-generated plans
- Daily adaptation
- Clean dashboard

---

## 🎯 Success Criteria

- Fast check-in (<30 seconds)
- Clear AI recommendations
- Smooth UX

---

## 👥 Team

- Eduardo Lorenzo — Backend & AI
- Felix Martinez — Frontend & UX

---

## ⚡ Philosophy

> “Don’t just train harder. Train smarter.”
