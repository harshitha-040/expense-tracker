# Expense Tracker 💰

[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

A full-stack personal finance management application designed to help users track their income and expenses, manage categories, and visualize their financial health through an intuitive dashboard.

---

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
- **Transaction Management**: Easily add, edit, and delete income and expense transactions.
- **Category Management**: Organize transactions with custom categories.
- **Interactive Dashboard**: Real-time analytics and charts (powered by Recharts) to visualize spending patterns.
- **Transaction History**: Searchable and filterable history of all financial activities.
- **Protected Routes**: Secure navigation ensuring only authenticated users can access financial data.
- **Responsive UI**: Fully responsive design optimized for both desktop and mobile devices.
- **Modern Aesthetics**: Built with Tailwind CSS and Framer Motion for smooth animations and a polished look.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot
- **Security**: Spring Security + JWT Authentication
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: MySQL
- **Tooling**: Maven, Lombok

### Frontend
- **Library**: React 19 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Framer Motion
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
│   │   ├── api/          # Axios configuration
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
2. Create a new database named `expensetracker`.
3. Import the provided SQL schema:
   ```bash
   mysql -u your_username -p expensetracker < database/expensetracker.sql
   ```
4. Update the database credentials in `src/main/resources/application.yaml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/expensetracker
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

The application employs **JWT (JSON Web Token)** for stateless authentication.
- Upon successful login, the server issues a JWT.
- The token is stored on the client side and included in the `Authorization` header (`Bearer <token>`) for all subsequent API requests.
- Spring Security intercepts requests to validate the token and authorize access to protected resources.

---

## 🔮 Future Enhancements
- [ ] **Multi-currency Support**: Handle transactions in different currencies with real-time conversion.
- [ ] **Budgeting**: Set monthly spending limits for specific categories and receive alerts.
- [ ] **Report Export**: Export transaction history to PDF or Excel.
- [ ] **Social Login**: Integration with Google/GitHub OAuth.
- [ ] **Dark Mode**: Toggle between light and dark themes.

---

## 📸 Screenshots

| Dashboard | Transactions | Login |
| :---: | :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/400x250?text=Dashboard+Analytics) | ![Transactions Placeholder](https://via.placeholder.com/400x250?text=Transaction+History) | ![Login Placeholder](https://via.placeholder.com/400x250?text=JWT+Login+UI) |

---

## 👔 Resume-Friendly Description

**Full-Stack Web Developer | Expense Tracker Project**
- Developed a comprehensive full-stack Expense Tracker using **Spring Boot** and **React (TypeScript)**, enabling users to manage finances with 100% data integrity.
- Engineered a secure authentication system using **JWT** and **Spring Security**, protecting sensitive user data and ensuring authorized access to RESTful APIs.
- Designed an interactive analytics dashboard with **Recharts**, providing users with visual insights into spending habits and budget allocation.
- Optimized frontend performance using **Vite** and implemented a responsive, modern UI with **Tailwind CSS**, achieving a seamless user experience across devices.
- Leveraged **Spring Data JPA** and **MySQL** for robust data persistence, implementing complex queries for transaction filtering and aggregation.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
