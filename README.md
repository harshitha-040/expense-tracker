# Expense Tracker 💰

[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

A full-stack personal finance management application designed to help users track their income and expenses, manage categories, and visualize their financial health through an intuitive dashboard.

---

## 🚀 Features

- **User Authentication**: Registration and login management with session handling based on user email.
- **Transaction Management**: Easily add, edit, and delete income and expense transactions.
- **Category Management**: Organize transactions with custom categories.
- **Interactive Dashboard**: Real-time analytics and charts (powered by Recharts) to visualize spending patterns.
- **Transaction History**: Searchable and filterable history of all financial activities.
- **Protected Routes**: Secure navigation ensuring only registered users can access financial data.
- **Responsive UI**: Fully responsive design optimized for both desktop and mobile devices.
- **Modern Aesthetics**: Built with Tailwind CSS and Framer Motion for smooth animations and a polished look.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.4
- **Security**: Spring Security (Permissive for development)
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: MySQL
- **Tooling**: Maven, Lombok

### Frontend
- **Library**: React 19 (TypeScript)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4, Framer Motion
- **Icons**: Lucide React
- **State/Routing**: React Router 7
- **Data Visualization**: Recharts
- **API Client**: Axios

---

## 📂 Project Structure

```text
expense-tracker/
├── frontend/             # React + TypeScript Frontend
│   ├── src/
│   │   ├── api/          # Axios configuration with user context interceptors
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth & Theme context providers
│   │   ├── pages/        # Main application views
│   │   ├── services/     # API service layer
│   │   └── types/        # TypeScript interfaces
├── src/                  # Spring Boot Backend (Java)
│   ├── main/java/com/.../
│   │   ├── config/       # Security & App configurations
│   │   ├── controller/   # REST Endpoints
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entity/       # JPA Entities
│   │   ├── repository/   # Data Access Layer
│   │   └── service/      # Business Logic
├── database/             # SQL scripts for database initialization
└── pom.xml               # Maven dependencies
```

---

## ⚙️ Installation and Setup

### 1. Prerequisites
- **JDK 17** or higher
- **Node.js** (v18+) and **npm**
- **MySQL Server**
- **Maven**

### 2. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or CLI).
2. Create a new database named `expense_tracker`.
3. Import the provided SQL schema:
   ```bash
   mysql -u your_username -p expense_tracker < database/expensetracker.sql
   ```
4. Update the database credentials in `src/main/resources/application.yaml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/expense_tracker
       username: your_username
       password: your_password
   ```

### 3. Backend Setup
1. Navigate to the project root.
2. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will start on `http://localhost:8080`.*

### 4. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on `http://localhost:5173`.*

---

## 🔒 API Security

The application currently uses a simplified authentication model for development:
- **Session Management**: User session info is stored in `localStorage` upon login.
- **Request Identification**: The frontend includes an `X-User-Email` header in API requests via an Axios interceptor.
- **Authorization**: The backend identifies users by their email to provide personalized data. 
- *Note: JWT-based stateless authentication is planned for future production-ready versions.*

---

## 🔮 Future Enhancements
- [ ] **JWT Authentication**: Implement secure token-based authentication.
- [ ] **Multi-currency Support**: Handle transactions in different currencies.
- [ ] **Budgeting**: Set monthly spending limits and receive alerts.
- [ ] **Report Export**: Export transaction history to PDF or Excel.
- [ ] **Dark Mode**: Improved theme switching stability.

---

## 👔 Resume-Friendly Description

**Full-Stack Web Developer | Expense Tracker Project**
- Developed a comprehensive full-stack Expense Tracker using **Spring Boot** and **React (TypeScript)**, enabling users to manage finances with 100% data integrity.
- Designed an interactive analytics dashboard with **Recharts**, providing users with visual insights into spending habits and budget allocation.
- Optimized frontend performance using **Vite** and implemented a responsive, modern UI with **Tailwind CSS**, achieving a seamless user experience across devices.
- Leveraged **Spring Data JPA** and **MySQL** for robust data persistence, implementing complex queries for transaction filtering and aggregation.

