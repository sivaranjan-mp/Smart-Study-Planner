# Smart Study Planner & Task Management System

A full-stack, single-entity study task manager built with **Spring Boot 3 (Java 21)** and **React (Vite + MUI)**.

## Project Structure

```
smart-study-planner/
├── .gitignore
├── README.md
├── docs/
│   ├── architecture.md                # Architecture blueprint and roadmap
│   └── schema.sql                     # MySQL database schema and indexes
├── backend/                           # Spring Boot 3 Maven backend
└── frontend/                          # React + Vite + Material UI frontend
```

## Tech Stack

- **Backend**: Spring Boot 3, Java 21, Spring Data JPA, Hibernate, MySQL, Jakarta Validation, springdoc-openapi, Lombok
- **Frontend**: React 18, Vite, Material UI (MUI), Axios, React Router, `@mui/x-date-pickers`, Dayjs
- **Database**: MySQL 8.x (`study_planner_db`)

## Getting Started

### Prerequisites
- **Java 21+**
- **Node.js (LTS)** & `npm`
- **MySQL 8.x**

### Database Setup
Run the SQL script in `docs/schema.sql` on your MySQL instance:
```bash
mysql -u root -p < docs/schema.sql
```

### Running Backend
```bash
cd backend
./mvnw spring-boot:run
```
The API and Swagger UI will be available at:
- API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```
The Vite development server runs at `http://localhost:5173`.
