# 📚 Smart Study Planner & Task Management System

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Material UI](https://img.shields.io/badge/MUI-v5-007FFF.svg)](https://mui.com/)
[![MySQL 8](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

A full-stack, enterprise-grade study planner and task management application designed for students and learners. Built with **Spring Boot 3 (Java 21)** on the backend and **React 18 (Vite + Material UI)** on the frontend, communicating over a clean, standardized REST/JSON contract.

---

## 🌟 Key Features

- 📊 **Dynamic Dashboard**: Real-time summary cards (total, completed, pending, in-progress), circular completion progress, and nearest upcoming deadlines list.
- 📋 **Comprehensive Task CRUD**: Create, read, update (full-replace), and delete study tasks with confirmation safeguards.
- 🔍 **Debounced Search**: Instant, debounced (300ms) search across task titles and academic subjects.
- 🏷️ **Multi-Criteria Filtering & Sorting**: Filter dynamically by Priority (`HIGH`, `MEDIUM`, `LOW`) and Status (`PENDING`, `IN_PROGRESS`, `COMPLETED`), with server-side sorting by deadline or creation date.
- 📱 **Fully Responsive UI**: Seamless desktop table view (`md+`) that adapts to stacked touch cards on mobile/tablet viewports (`xs`/`sm`).
- 🛡️ **Robust Validation & Error Handling**: Jakarta Bean Validation on the backend mirrored with instant client-side validation; uniform `ApiResponse<T>` and `ErrorResponse` envelopes.
- 📖 **Interactive API Documentation**: Live Swagger UI / OpenAPI documentation and ready-to-run Postman test collection.

---

## 🏗️ Architecture & Monorepo Structure

```
smart-study-planner/
├── .gitignore
├── README.md                          # Root project guide & instructions
├── docs/                              # Centralized technical documentation
│   ├── architecture.md                # Full system blueprint & development plan
│   ├── api-documentation.md           # REST API technical reference & contracts
│   ├── er-diagram.md                  # Entity-Relationship diagram & schema dictionary
│   ├── schema.sql                     # Production MySQL DDL script with indexes
│   └── postman/
│       └── Smart-Study-Planner.postman_collection.json  # Comprehensive Postman collection
├── backend/                           # Spring Boot 3 + Java 21 REST API
│   ├── pom.xml
│   ├── src/main/java/com/studyplanner/taskmanager/
│   │   ├── config/                    # CORS, Jackson, OpenAPI configs
│   │   ├── controller/                # Task & Dashboard REST controllers
│   │   ├── dto/                       # Request/Response DTO contracts & envelopes
│   │   ├── entity/                    # JPA Entities (Task) & Enums (Priority, Status)
│   │   ├── exception/                 # GlobalExceptionHandler & custom exceptions
│   │   ├── mapper/                    # TaskMapper (Entity ⇄ DTO)
│   │   ├── repository/                # Spring Data JPA repositories & specifications
│   │   ├── service/                   # Service interfaces and implementations
│   │   └── util/                      # Helper utilities (SortDirectionResolver)
│   └── src/main/resources/            # Application profiles (dev, prod)
└── frontend/                          # React 18 + Vite SPA
    ├── package.json
    ├── .env.development               # Local API base URL configuration
    ├── .env.production                # Production API base URL
    ├── src/
    │   ├── components/                # Modular UI components (tasks, dashboard, common)
    │   ├── hooks/                     # Custom data-fetching hooks (useTasks, useTask, etc.)
    │   ├── layouts/                   # MainLayout, AppHeader, AppSidebar
    │   ├── pages/                     # DashboardPage, TaskListPage, AddTaskPage, etc.
    │   ├── routes/                    # AppRoutes (React Router)
    │   ├── services/                  # apiClient (Axios), taskService, dashboardService
    │   ├── theme/                     # Material UI custom theme tokens
    │   └── utils/                     # Validators, date formatters, constants
```

---

## ⚙️ Prerequisites

Ensure the following tools are installed on your machine:

1. **Java Development Kit (JDK) 21+**: [Download OpenJDK / Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java21)
2. **Node.js (LTS v18+ or v20+) & npm**: [Download Node.js](https://nodejs.org/)
3. **MySQL Server 8.x**: [Download MySQL](https://dev.mysql.com/downloads/installer/)
4. **Apache Maven** (optional, Maven Wrapper `./mvnw` is included in `backend/`)
5. **Postman** (optional, for API testing): [Download Postman](https://www.postman.com/)

---

## 🚀 Getting Started

### Step 1: Database Setup

1. Start your local MySQL 8 server.
2. Log into MySQL and execute the provided schema script [docs/schema.sql](file:///p:/Projects/smart-study-planner/docs/schema.sql):

```bash
mysql -u root -p < docs/schema.sql
```

Alternatively, run the SQL commands directly in MySQL Workbench or your database IDE:
```sql
CREATE DATABASE IF NOT EXISTS study_planner_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

---

### Step 2: Backend Setup & Execution

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Check database credentials in `src/main/resources/application-dev.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/study_planner_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   *(Adjust username and password if your local MySQL configuration differs.)*

3. Build and launch the Spring Boot backend:
   - **Linux / macOS**:
     ```bash
     ./mvnw spring-boot:run
     ```
   - **Windows (PowerShell / CMD)**:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **Or using global Maven**:
     ```bash
     mvn spring-boot:run
     ```

4. Verify backend availability:
   - **Base API Endpoint**: `http://localhost:8080/api/tasks`
   - **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - **OpenAPI v3 Docs**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

### Step 3: Frontend Setup & Execution

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify environment configuration in `.env.development`:
   ```properties
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Launch the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   - **Frontend Application**: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing & Quality Assurance

### Backend Automated Tests

Run JUnit 5 unit and integration tests (Controller, Service, and Repository layers):
```bash
cd backend
./mvnw test
```

### Frontend Code Quality & Production Build

Verify linting and production bundle compilation:
```bash
cd frontend
npm run lint
npm run build
```

### Postman Automated API Collection

The repository includes a ready-to-run Postman collection with test scripts:

1. Import [docs/postman/Smart-Study-Planner.postman_collection.json](file:///p:/Projects/smart-study-planner/docs/postman/Smart-Study-Planner.postman_collection.json) into Postman.
2. Select the **Collection Runner** to execute all 12 test requests (CRUD, Search, Filter, Dashboard Aggregates, 400 Bad Request, 404 Not Found).
3. All assertions verify HTTP status codes and envelope schema consistency.

---

## 📖 Technical Documentation

- 📄 **[API Documentation](file:///p:/Projects/smart-study-planner/docs/api-documentation.md)**: Full REST contract, request/response JSON schemas, query params, and error codes per Section 12.
- 📐 **[ER Diagram & Database Schema](file:///p:/Projects/smart-study-planner/docs/er-diagram.md)**: Mermaid/ASCII entity-relationship diagrams, schema dictionary, and indexing strategy.
- 🏛️ **[System Architecture](file:///p:/Projects/smart-study-planner/docs/architecture.md)**: Comprehensive blueprint, development roadmap, and cross-stack conventions.
- 🗄️ **[SQL DDL Script](file:///p:/Projects/smart-study-planner/docs/schema.sql)**: MySQL table definition and performance indexes.

---

## 🌿 Git Workflow & Conventions

- **Branching Strategy**:
  - `main`: Protected, production-ready release branch.
  - `develop`: Integration branch.
  - `feature/*`: Dedicated branches for specific features (`feature/frontend-dashboard`, `feature/backend-task-crud`).
- **Commit Convention**: [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` New user-facing features
  - `fix:` Bug fixes
  - `refactor:` Code refactoring without behavioral change
  - `docs:` Documentation updates
  - `test:` Adding or updating tests
  - `chore:` Dependency and build configuration changes

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
