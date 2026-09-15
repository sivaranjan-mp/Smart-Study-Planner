# Smart Study Planner & Task Management System
## Complete Architecture, Folder Structure & Development Plan

**Stack:** React (Vite) + MUI + Axios + React Router | Spring Boot 3 / Java 21 / Maven | MySQL | Postman | Git/GitHub
**Document purpose:** Enterprise-grade blueprint detailed enough for independent, file-by-file implementation by a development team or an AI coding agent. No business logic code is included — only structure, responsibilities, contracts, and sequencing.

---

## 1. High-Level Architecture (ASCII)

```
┌──────────────────────────────────────────────────────────────────────┐
│                             CLIENT (Browser)                          │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  React 18 + Vite SPA                                            │  │
│  │  ─────────────────────────────────────────────────────────────  │  │
│  │  Pages → Components → Hooks → Services (Axios) → API Client     │  │
│  │  React Router (client-side routing)                             │  │
│  │  MUI Theme + Layout (AppBar, Sidebar, Container)                │  │
│  └───────────────────────────────┬────────────────────────────────┘  │
└──────────────────────────────────┼────────────────────────────────────┘
                                    │ HTTPS / JSON (REST)
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         SERVER (Spring Boot 3)                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Controller Layer   → REST endpoints, request/response mapping  │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  Service Layer      → Interfaces (contracts)                    │  │
│  │  Service Impl Layer → Business logic, validation orchestration  │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  Repository Layer   → Spring Data JPA (interfaces only)         │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  Entity Layer        → JPA-mapped domain model                  │  │
│  │  DTO Layer           → Request / Response contracts             │  │
│  │  Mapper Layer        → Entity ⇄ DTO conversion                  │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  Exception Layer     → Global handler, custom exceptions        │  │
│  │  Config Layer        → CORS, Swagger/OpenAPI, Web config        │  │
│  └───────────────────────────────┬────────────────────────────────┘  │
└──────────────────────────────────┼────────────────────────────────────┘
                                    │ JDBC (Hibernate / JPA)
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                              MySQL 8.x                                 │
│                     Database: study_planner_db                         │
│                          Table: tasks                                  │
└──────────────────────────────────────────────────────────────────────┘
```

**Architectural style:** Layered (N-tier) monolith on the backend, SPA on the frontend, communicating over a stateless REST/JSON contract. This is intentionally the simplest architecture that satisfies clean-architecture separation of concerns — appropriate for a single-entity CRUD system, while still being extensible (e.g., adding Users/Auth later slots cleanly into the same layers).

---

## 2. Complete Project (Monorepo) Folder Structure

```
smart-study-planner/
├── .gitignore
├── README.md
├── LICENSE
├── docs/
│   ├── architecture.md                # (this document, or a trimmed version)
│   ├── er-diagram.png / .md
│   ├── api-documentation.md
│   └── postman/
│       └── Smart-Study-Planner.postman_collection.json
├── backend/
│   └── (Spring Boot Maven project — see Section 4)
└── frontend/
    └── (React + Vite project — see Section 5)
```

**Rationale:** A monorepo keeps frontend/backend versioned together for a student/portfolio-scale project, while each sub-project remains independently runnable/deployable (backend as a Spring Boot jar, frontend as a static build). `docs/` centralizes non-code deliverables (ER diagram, Postman collection, API docs) so they're discoverable without digging into either sub-project.

---

## 3. Database Design

### 3.1 ER Diagram (ASCII)

Single-entity system for v1 (no relational joins needed yet — designed so a `users` table can be added later without restructuring `tasks`):

```
┌─────────────────────────────────┐
│              TASKS               │
├─────────────────────────────────┤
│ PK  id              BIGINT       │
│     task_name       VARCHAR(150) │
│     subject         VARCHAR(100) │
│     description     TEXT         │
│     priority        ENUM         │
│     deadline        DATETIME     │
│     status          ENUM         │
│     created_at      DATETIME     │
│     updated_at      DATETIME     │
└─────────────────────────────────┘
```

*(Future extension point, not built in v1: `user_id` FK → `users.id`, once authentication is introduced.)*

### 3.2 MySQL Schema

**File:** `docs/schema.sql` (also mirrored by Hibernate `ddl-auto` in dev, but keep an explicit SQL file for production migrations / review)

Table: `tasks`

| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| task_name | VARCHAR(150) | NOT NULL |
| subject | VARCHAR(100) | NOT NULL |
| description | TEXT | NULL |
| priority | ENUM('HIGH','MEDIUM','LOW') | NOT NULL, DEFAULT 'MEDIUM' |
| deadline | DATETIME | NOT NULL |
| status | ENUM('PENDING','IN_PROGRESS','COMPLETED') | NOT NULL, DEFAULT 'PENDING' |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

**Constraints:**
- `id`: primary key, surrogate, auto-increment.
- `task_name`, `subject`, `deadline`: `NOT NULL` — enforced again at DTO validation layer (defense in depth).
- `priority`, `status`: stored as MySQL `ENUM` at the DB layer for integrity; mapped to Java `enum` via `@Enumerated(EnumType.STRING)` (never `ORDINAL` — protects against data corruption if enum order changes).
- `updated_at`: auto-refreshed by DB and mirrored in the entity via `@PreUpdate`.

**Index recommendations:**

| Index | Columns | Purpose |
|---|---|---|
| `idx_tasks_deadline` | `deadline` | Sorting/filtering upcoming deadlines (dashboard widget, sort-by-deadline) |
| `idx_tasks_status` | `status` | Filter feature, dashboard counts (Pending/Completed) |
| `idx_tasks_priority` | `priority` | Filter feature |
| `idx_tasks_subject` | `subject` | Search feature |
| `idx_tasks_status_deadline` (composite) | `status, deadline` | Optimizes "upcoming pending deadlines" query used by dashboard |

Full-text search on `task_name`/`subject` is unnecessary at this scale — a `LIKE '%term%'` query via JPA `Specification`/derived query is sufficient and keeps the schema simple.

---

## 4. Backend — Spring Boot 3 / Java 21 / Maven

### 4.1 Package Structure

Base package: `com.studyplanner.taskmanager`

```
backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/studyplanner/taskmanager/
│   │   │   ├── TaskManagerApplication.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── JacksonConfig.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   └── TaskController.java
│   │   │   │
│   │   │   ├── service/
│   │   │   │   └── TaskService.java
│   │   │   │
│   │   │   ├── service/impl/
│   │   │   │   └── TaskServiceImpl.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   └── TaskRepository.java
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── Task.java
│   │   │   │   ├── Priority.java              (enum)
│   │   │   │   └── Status.java                (enum)
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   ├── TaskCreateRequest.java
│   │   │   │   │   ├── TaskUpdateRequest.java
│   │   │   │   │   └── TaskFilterRequest.java
│   │   │   │   └── response/
│   │   │   │       ├── TaskResponse.java
│   │   │   │       ├── ApiResponse.java
│   │   │   │       ├── ErrorResponse.java
│   │   │   │       ├── PagedResponse.java
│   │   │   │       └── DashboardSummaryResponse.java
│   │   │   │
│   │   │   ├── mapper/
│   │   │   │   └── TaskMapper.java
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── InvalidRequestException.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │
│   │   │   └── util/
│   │   │       └── SortDirectionResolver.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── db/migration/                  (optional: Flyway, if added later)
│   │           └── V1__create_tasks_table.sql
│   │
│   └── test/
│       └── java/com/studyplanner/taskmanager/
│           ├── controller/TaskControllerTest.java
│           ├── service/TaskServiceImplTest.java
│           └── repository/TaskRepositoryTest.java
```

### 4.2 File-by-File Responsibilities

#### Bootstrap
| File | Responsibility |
|---|---|
| `TaskManagerApplication.java` | `@SpringBootApplication` entry point; `main()` method only. No business logic. |

#### `config/`
| File | Responsibility |
|---|---|
| `CorsConfig.java` | Implements `WebMvcConfigurer`; registers allowed origins (`http://localhost:5173` for dev, deployed frontend URL for prod via property placeholder), allowed methods (GET/POST/PUT/DELETE/OPTIONS), allowed headers, and `allowCredentials` policy. Reads allowed origin from `application.properties` (`app.cors.allowed-origin`) rather than hardcoding. |
| `OpenApiConfig.java` | Configures springdoc-openapi `OpenAPI` bean: title, version, description, contact — powers auto-generated Swagger UI at `/swagger-ui.html`, serving as living API documentation. |
| `JacksonConfig.java` | Registers `JavaTimeModule` and a global date/time serialization format (ISO-8601) so `LocalDateTime` fields serialize consistently for the frontend. |

#### `entity/`
| File | Responsibility |
|---|---|
| `Task.java` | JPA `@Entity` mapped to `tasks` table. Fields: `id, taskName, subject, description, priority, deadline, status, createdAt, updatedAt`. Uses `@Enumerated(EnumType.STRING)` for `priority`/`status`. `@PrePersist` sets `createdAt`/`updatedAt`; `@PreUpdate` refreshes `updatedAt`. No business logic beyond lifecycle callbacks — entities stay anemic by design; logic lives in the service layer. |
| `Priority.java` | Enum: `HIGH, MEDIUM, LOW`. |
| `Status.java` | Enum: `PENDING, IN_PROGRESS, COMPLETED`. |

#### `dto/request/`
| File | Responsibility |
|---|---|
| `TaskCreateRequest.java` | Inbound payload for `POST /api/tasks`. Fields: `taskName` (`@NotBlank`, `@Size(max=150)`), `subject` (`@NotBlank`, `@Size(max=100)`), `description` (`@Size(max=2000)`, optional), `priority` (`@NotNull`), `deadline` (`@NotNull`, `@Future` or `@FutureOrPresent` per business rule), `status` (optional — defaults server-side to `PENDING` if omitted). |
| `TaskUpdateRequest.java` | Inbound payload for `PUT /api/tasks/{id}`. Same validation rules as create; all fields required for a full-replace PUT semantics (document if partial update via PATCH is desired later). |
| `TaskFilterRequest.java` | Bound from query params for `GET /api/tasks/filter`: `priority` (optional), `status` (optional), `sortBy` (enum: `deadline`\|`createdAt`), `sortDirection` (`asc`\|`desc`), `page`, `size`. |

#### `dto/response/`
| File | Responsibility |
|---|---|
| `TaskResponse.java` | Outbound representation of a `Task` — mirrors entity fields but is a distinct class so entity structure is never leaked directly to clients. |
| `ApiResponse.java` | Generic wrapper: `{ success: boolean, message: String, data: T, timestamp }`. Every successful controller response is wrapped in this for a consistent contract. |
| `ErrorResponse.java` | Standard error shape returned by `GlobalExceptionHandler`: `{ success: false, message, errorCode, details: [...], timestamp, path }`. |
| `PagedResponse.java` | Wraps paginated list results: `{ content: List<TaskResponse>, page, size, totalElements, totalPages, last }`. |
| `DashboardSummaryResponse.java` | `{ totalTasks, completedTasks, pendingTasks, inProgressTasks, completionPercentage, upcomingDeadlines: List<TaskResponse> }`. |

#### `mapper/`
| File | Responsibility |
|---|---|
| `TaskMapper.java` | Pure static/component conversion methods: `toEntity(TaskCreateRequest)`, `updateEntityFromRequest(Task, TaskUpdateRequest)`, `toResponse(Task)`, `toResponseList(List<Task>)`. Keeps controller/service free of manual field-copying. Can be a plain `@Component` class (hand-written) or MapStruct-generated — architecture doc recommends **hand-written for a learning project**, MapStruct if the team wants less boilerplate. |

#### `repository/`
| File | Responsibility |
|---|---|
| `TaskRepository.java` | `interface TaskRepository extends JpaRepository<Task, Long>`. Declares derived-query methods only (no implementation — Spring Data generates it): `findByStatus(Status)`, `findByPriority(Priority)`, `findByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(String, String)`, `findByDeadlineBetween(...)`, `countByStatus(Status)`. For combined dynamic filters, extend `JpaSpecificationExecutor<Task>` and build a `TaskSpecification` helper (or use `@Query` with optional params). |

#### `service/` (interface) and `service/impl/`
| File | Responsibility |
|---|---|
| `TaskService.java` | Interface declaring the contract: `createTask`, `getAllTasks(Pageable)`, `getTaskById(Long)`, `updateTask(Long, TaskUpdateRequest)`, `deleteTask(Long)`, `searchTasks(String keyword, Pageable)`, `filterTasks(TaskFilterRequest)`, `getDashboardSummary()`. Depending purely on this interface (not the impl) is what lets the controller be unit-testable via mocks. |
| `TaskServiceImpl.java` | `@Service` implementing `TaskService`. Owns all business rules: validation beyond annotations (e.g., "deadline cannot be in the past on create"), orchestrating repository calls, throwing `ResourceNotFoundException` when an id doesn't exist, computing dashboard aggregates, delegating entity⇄DTO conversion to `TaskMapper`. |

#### `controller/`
| File | Responsibility |
|---|---|
| `TaskController.java` | `@RestController @RequestMapping("/api/tasks")`. Thin layer: binds/validates request (`@Valid`), delegates to `TaskService`, wraps result in `ApiResponse`/`PagedResponse`, sets HTTP status codes (`201` create, `200` read/update, `204` or `200` delete). No business logic here — see endpoint list in Section 4.3. Also hosts a nested/related `DashboardController` (see below) or a separate controller class if preferred. |
| *(optional)* `DashboardController.java` | `GET /api/dashboard/summary` — kept in a dedicated controller for single-responsibility, since dashboard is a distinct concern from raw task CRUD even though it reads the same table. |

#### `exception/`
| File | Responsibility |
|---|---|
| `ResourceNotFoundException.java` | Unchecked exception thrown when a task id lookup fails. Carries a message like `"Task not found with id: {id}"`. |
| `InvalidRequestException.java` | Thrown for business-rule violations that aren't simple field validation (e.g., invalid filter combination). |
| `GlobalExceptionHandler.java` | `@RestControllerAdvice`. Maps: `MethodArgumentNotValidException` → `400` with field-level details; `ResourceNotFoundException` → `404`; `InvalidRequestException` → `400`; generic `Exception` → `500` with a safe generic message (never leak stack traces to the client). Always returns `ErrorResponse`. |

#### `util/`
| File | Responsibility |
|---|---|
| `SortDirectionResolver.java` | Small helper to safely translate query-param strings (`"asc"`/`"desc"`) into `Sort.Direction`, defaulting safely on invalid input rather than throwing. |

#### `resources/`
| File | Responsibility |
|---|---|
| `application.properties` | Common properties: app name, server port (`8080`), `spring.jpa.open-in-view=false`, default profile activation. |
| `application-dev.properties` | `spring.datasource.url=jdbc:mysql://localhost:3306/study_planner_db`, credentials, `spring.jpa.hibernate.ddl-auto=update`, `spring.jpa.show-sql=true`, `app.cors.allowed-origin=http://localhost:5173`. |
| `application-prod.properties` | Same keys, values sourced from environment variables (`${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`), `ddl-auto=validate` (never auto-alter prod schema), `show-sql=false`. |

### 4.3 REST API Contract

| Method | Endpoint | Request Body / Params | Response | Notes |
|---|---|---|---|---|
| POST | `/api/tasks` | `TaskCreateRequest` | `201` `ApiResponse<TaskResponse>` | Creates a task |
| GET | `/api/tasks` | Query: `page, size, sortBy, sortDirection` | `200` `ApiResponse<PagedResponse<TaskResponse>>` | Paginated list, default sort `createdAt desc` |
| GET | `/api/tasks/{id}` | Path: `id` | `200` `ApiResponse<TaskResponse>` / `404` | Single task |
| PUT | `/api/tasks/{id}` | Path: `id`, Body: `TaskUpdateRequest` | `200` `ApiResponse<TaskResponse>` / `404` | Full update |
| DELETE | `/api/tasks/{id}` | Path: `id` | `200`/`204` `ApiResponse<Void>` / `404` | Delete |
| GET | `/api/tasks/search` | Query: `keyword, page, size` | `200` `ApiResponse<PagedResponse<TaskResponse>>` | Matches `taskName` OR `subject` |
| GET | `/api/tasks/filter` | Query: `priority, status, sortBy, sortDirection, page, size` | `200` `ApiResponse<PagedResponse<TaskResponse>>` | All params optional/combinable |
| GET | `/api/dashboard/summary` | — | `200` `ApiResponse<DashboardSummaryResponse>` | Aggregates for dashboard widgets |

### 4.4 API Flow Diagram (example: Create Task)

```
Client (AddTaskPage)
   │  POST /api/tasks  { taskName, subject, priority, deadline, ... }
   ▼
TaskController.createTask(@Valid TaskCreateRequest)
   │  Bean Validation runs first (Jakarta Validation) → 400 short-circuits on failure
   ▼
TaskService.createTask(request)
   ▼
TaskServiceImpl.createTask(request)
   │  1. TaskMapper.toEntity(request)
   │  2. Apply defaults (status = PENDING if absent)
   │  3. TaskRepository.save(entity)
   │  4. TaskMapper.toResponse(savedEntity)
   ▼
TaskRepository.save(task)  ──▶  MySQL INSERT INTO tasks (...)
   ▲
   │  returns persisted entity (id, createdAt, updatedAt populated)
   ▼
TaskServiceImpl returns TaskResponse
   ▼
TaskController wraps in ApiResponse, returns 201 Created
   ▼
Client receives { success: true, data: {...} } → updates UI, navigates to Task Details
```

Read/Update/Delete/Search/Filter follow the same pattern: Controller → Service (interface) → ServiceImpl (logic) → Repository → MySQL, with Mapper conversions at the DTO/Entity boundary and `GlobalExceptionHandler` catching failures at any point in the chain.

---

## 5. Frontend — React (Vite) + MUI + Axios + React Router

### 5.1 Folder Structure

```
frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env.development                    # VITE_API_BASE_URL=http://localhost:8080/api
├── .env.production
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── theme/
    │   └── theme.js
    ├── routes/
    │   └── AppRoutes.jsx
    ├── layouts/
    │   ├── MainLayout.jsx
    │   ├── AppHeader.jsx
    │   └── AppSidebar.jsx
    ├── pages/
    │   ├── DashboardPage.jsx
    │   ├── TaskListPage.jsx
    │   ├── AddTaskPage.jsx
    │   ├── EditTaskPage.jsx
    │   ├── TaskDetailsPage.jsx
    │   └── NotFoundPage.jsx
    ├── components/
    │   ├── dashboard/
    │   │   ├── SummaryCard.jsx
    │   │   ├── CompletionChart.jsx
    │   │   └── UpcomingDeadlinesList.jsx
    │   ├── tasks/
    │   │   ├── TaskForm.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskTable.jsx
    │   │   ├── TaskFilterBar.jsx
    │   │   ├── TaskSearchBar.jsx
    │   │   ├── PriorityChip.jsx
    │   │   └── StatusChip.jsx
    │   └── common/
    │       ├── ConfirmDialog.jsx
    │       ├── LoadingSpinner.jsx
    │       ├── EmptyState.jsx
    │       ├── ErrorBanner.jsx
    │       └── PageHeader.jsx
    ├── services/
    │   ├── apiClient.js
    │   ├── taskService.js
    │   └── dashboardService.js
    ├── hooks/
    │   ├── useTasks.js
    │   ├── useTask.js
    │   ├── useDashboardSummary.js
    │   └── useDebounce.js
    ├── context/
    │   └── TaskContext.jsx                 (optional — see State Management section)
    ├── utils/
    │   ├── dateUtils.js
    │   ├── constants.js                    (Priority/Status enums, sort options)
    │   └── validators.js
    └── assets/
        └── (icons, images)
```

### 5.2 File-by-File Responsibilities

| File | Responsibility |
|---|---|
| `main.jsx` | React root render; mounts `<App />`, wraps with `BrowserRouter` and MUI `ThemeProvider`/`CssBaseline`. |
| `App.jsx` | Top-level shell; renders `MainLayout` wrapping `AppRoutes`. |
| `theme/theme.js` | MUI `createTheme()` — palette, typography scale, shape (border radius), component style overrides. Single source of visual truth. |
| `routes/AppRoutes.jsx` | `<Routes>` declaration mapping paths to pages (see Section 5.3). Centralizing routes here (vs. scattering in `App.jsx`) keeps navigation structure discoverable in one file. |
| `layouts/MainLayout.jsx` | Persistent shell: `AppHeader` + `AppSidebar` + `<Outlet />` (or `{children}`) content area; MUI `Box`/`Container` responsive grid. |
| `layouts/AppHeader.jsx` | Top `AppBar`: app title, maybe a quick "Add Task" button. |
| `layouts/AppSidebar.jsx` | Nav `Drawer`/list: Dashboard, Task List, Add Task links; collapses to icon-only or hidden drawer on mobile (MUI `useMediaQuery`). |
| `pages/DashboardPage.jsx` | Fetches summary via `useDashboardSummary`; composes `SummaryCard` ×4, `CompletionChart`, `UpcomingDeadlinesList`. No direct API calls — delegates to hooks/services. |
| `pages/TaskListPage.jsx` | Fetches paginated tasks via `useTasks`; renders `TaskSearchBar`, `TaskFilterBar`, `TaskTable` (or `TaskCard` grid on mobile), pagination controls, "Add Task" CTA. Owns query-state (search term, filters, sort, page) and passes it down/into the hook. |
| `pages/AddTaskPage.jsx` | Renders `TaskForm` in "create" mode; on submit calls `taskService.createTask`, then navigates to `TaskDetailsPage` or back to list. |
| `pages/EditTaskPage.jsx` | Reads `:id` from route params, fetches existing task via `useTask(id)`, renders `TaskForm` pre-filled in "edit" mode; on submit calls `taskService.updateTask`. |
| `pages/TaskDetailsPage.jsx` | Reads `:id`, fetches via `useTask(id)`, renders read-only detail view with Edit/Delete actions; Delete opens `ConfirmDialog`. |
| `pages/NotFoundPage.jsx` | Catch-all `*` route; simple "404 — Page not found" with a link back to Dashboard. |
| `components/tasks/TaskForm.jsx` | Shared, controlled form used by both Add/Edit pages: fields for `taskName, subject, description, priority (Select), deadline (DateTimePicker), status (Select, hidden/defaulted on create)`. Client-side validation mirrors backend rules; disabled submit until valid. |
| `components/tasks/TaskCard.jsx` | Compact card for grid/mobile view of one task — name, subject, `PriorityChip`, `StatusChip`, deadline, quick actions. |
| `components/tasks/TaskTable.jsx` | MUI `Table`/`DataGrid`-style listing for desktop — sortable column headers wired to `sortBy`/`sortDirection` state. |
| `components/tasks/TaskFilterBar.jsx` | `Select` inputs for Priority/Status + sort dropdown; emits filter-state changes up to `TaskListPage`. |
| `components/tasks/TaskSearchBar.jsx` | Debounced text input (via `useDebounce`) searching name/subject. |
| `components/tasks/PriorityChip.jsx` / `StatusChip.jsx` | Presentational MUI `Chip` with color mapping (`HIGH`→error, `MEDIUM`→warning, `LOW`→success; `PENDING`→default, `IN_PROGRESS`→info, `COMPLETED`→success). |
| `components/dashboard/SummaryCard.jsx` | Generic stat card: label, number, icon, color — reused for Total/Completed/Pending/Completion %. |
| `components/dashboard/CompletionChart.jsx` | Visual (e.g., circular progress or simple bar) of completion percentage. |
| `components/dashboard/UpcomingDeadlinesList.jsx` | Small list of nearest-deadline pending tasks, each linking to `TaskDetailsPage`. |
| `components/common/ConfirmDialog.jsx` | Reusable MUI `Dialog` for destructive confirmations (delete task). |
| `components/common/LoadingSpinner.jsx` | Centered `CircularProgress` used during any async fetch. |
| `components/common/EmptyState.jsx` | "No tasks found" placeholder for empty lists/search results. |
| `components/common/ErrorBanner.jsx` | MUI `Alert severity="error"` for surfacing API failures. |
| `components/common/PageHeader.jsx` | Consistent page title + optional action button (e.g., "+ Add Task") across pages. |
| `services/apiClient.js` | Configured `axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })`; request/response interceptors (e.g., unwrap `ApiResponse.data`, centralize error normalization). Every other service imports this instead of raw `axios`. |
| `services/taskService.js` | Thin wrapper functions: `getTasks(params)`, `getTaskById(id)`, `createTask(payload)`, `updateTask(id, payload)`, `deleteTask(id)`, `searchTasks(params)`, `filterTasks(params)` — each simply calls `apiClient` and returns `response.data`. No React code here. |
| `services/dashboardService.js` | `getDashboardSummary()`. |
| `hooks/useTasks.js` | Encapsulates list-fetching state machine (`data, loading, error, refetch`) for `TaskListPage`, reacting to search/filter/sort/page dependencies. |
| `hooks/useTask.js` | Fetches a single task by id (`Details`/`Edit` pages share this). |
| `hooks/useDashboardSummary.js` | Fetches dashboard aggregate on mount. |
| `hooks/useDebounce.js` | Generic debounce utility hook for the search bar. |
| `context/TaskContext.jsx` | *(Optional, see 5.4)* — only needed if task data must be shared across sibling routes without prop drilling/refetching. |
| `utils/dateUtils.js` | Format `deadline`/`createdAt` for display (e.g., `dayjs` formatting), compute "days remaining" for dashboard. |
| `utils/constants.js` | `PRIORITY_OPTIONS`, `STATUS_OPTIONS`, `SORT_OPTIONS` arrays — single source of truth mirrored from backend enums, used to populate `Select` components. |
| `utils/validators.js` | Client-side field validators mirroring backend Bean Validation rules (required fields, max lengths, deadline not in the past). |

### 5.3 Routing Structure

| Path | Page Component | Notes |
|---|---|---|
| `/` | `DashboardPage` | Landing page |
| `/tasks` | `TaskListPage` | List + search + filter + sort |
| `/tasks/new` | `AddTaskPage` | Create form |
| `/tasks/:id` | `TaskDetailsPage` | Read-only view |
| `/tasks/:id/edit` | `EditTaskPage` | Edit form |
| `*` | `NotFoundPage` | Catch-all |

### 5.4 State Management Recommendation

For this application's scope (single resource type, no auth, no cross-cutting global state), **React Query (TanStack Query)** is the recommended data layer instead of a general global-state library:

- It natively provides caching, background refetch, loading/error states, and pagination support — exactly what `useTasks`/`useTask`/`useDashboardSummary` need — with far less boilerplate than hand-rolled hooks + Context.
- Local UI state (search text, active filters, current page, form field values) stays as plain `useState` inside the relevant page/component — it doesn't need to be global.
- **`TaskContext.jsx` is optional and likely unnecessary** if React Query is adopted; keep it in the structure only as a fallback if the team prefers to avoid adding a dependency and instead hand-roll fetching in the custom hooks listed above (`useTasks`, `useTask`, `useDashboardSummary`) using plain `useState`/`useEffect`.
- **Recommendation for the build sequence below:** start with the hand-rolled hooks (zero new dependencies, simpler for a first pass); swap their internals for React Query later without changing any page/component code, since pages only ever consume the hook's returned `{ data, loading, error, refetch }` shape.

### 5.5 Material UI Design Plan

- **Theme:** one custom theme (`theme/theme.js`) — primary color for brand/actions, semantic colors reused for `PriorityChip`/`StatusChip` (error/warning/success/info), consistent `borderRadius` and `spacing` unit (MUI default 8px grid).
- **Typography:** `h4`/`h5` for page titles (via `PageHeader`), `subtitle2` for card metadata, `body2` for descriptions.
- **Layout primitives:** `Container maxWidth="lg"` for page content, `Grid`/`Stack` for card layouts, `Paper` for elevated surfaces (forms, table containers).
- **Feedback:** `Snackbar` + `Alert` for toast-style success/error notifications after create/update/delete actions; `Skeleton` components as loading placeholders on the dashboard and list (nicer than a spinner for content-shaped loading).
- **Forms:** MUI `TextField`, `Select`, and a date-time picker (`@mui/x-date-pickers` with `LocalizationProvider`) for `deadline`.
- **Data display:** `DataGrid` (from `@mui/x-data-grid`, or a plain `Table` if avoiding the extra dependency) for `TaskTable`, with column sorting delegated to backend `sortBy`/`sortDirection` params rather than client-side sort, since sorting must reflect true DB order across pages.

### 5.6 Responsive Layout Plan

- **Breakpoints:** MUI defaults (`xs <600px, sm ≥600, md ≥900, lg ≥1200`).
- **Sidebar:** permanent `Drawer` on `md+`; temporary (overlay, toggled by a hamburger icon in `AppHeader`) on `xs`/`sm`.
- **Task list view:** `TaskTable` (dense table) on `md+`; switches to a stacked `TaskCard` list on `xs`/`sm` (`useMediaQuery(theme.breakpoints.down('md'))` toggles which component `TaskListPage` renders).
- **Dashboard summary cards:** `Grid container spacing={2}` with `item xs={12} sm={6} md={3}` — 1 column on phones, 2 on tablets, 4 on desktop.
- **Forms:** single-column stacked fields on `xs`, two-column (`Grid item xs={12} sm={6}`) for shorter fields (priority/status side-by-side) on `sm+`.

---

## 6. Development Roadmap

### Phase 0 — Project Setup (Day 1)
- Initialize Git repo, `.gitignore` (Java + Node), `README.md`.
- Scaffold backend: `spring initializr` (Web, JPA, MySQL Driver, Validation, springdoc-openapi, Lombok).
- Scaffold frontend: `npm create vite@latest frontend -- --template react`, install MUI, Axios, React Router, `@mui/x-date-pickers`, `dayjs`.
- Create MySQL database `study_planner_db`.

### Phase 1 — Backend Domain & Persistence (Day 2)
- `entity/Task.java`, `Priority.java`, `Status.java`.
- `repository/TaskRepository.java`.
- `application-dev.properties` DB connection; verify table auto-creation via `ddl-auto=update`.

### Phase 2 — Backend DTOs, Mapper, Exceptions (Day 3)
- All `dto/request` and `dto/response` classes.
- `mapper/TaskMapper.java`.
- `exception/*` + `GlobalExceptionHandler`.

### Phase 3 — Backend Service & Controller (Day 4–5)
- `service/TaskService.java` interface → `service/impl/TaskServiceImpl.java`.
- `controller/TaskController.java` wiring all 7 endpoints + dashboard endpoint.
- `config/CorsConfig.java`, `config/OpenApiConfig.java`.
- Manual verification via Swagger UI + Postman collection (`docs/postman/`).

### Phase 4 — Backend Testing (Day 6)
- `TaskRepositoryTest` (`@DataJpaTest`), `TaskServiceImplTest` (Mockito), `TaskControllerTest` (`@WebMvcTest` + `MockMvc`).
- Finalize Postman collection covering happy paths + validation/404 error cases.

### Phase 5 — Frontend Foundation (Day 7)
- `apiClient.js`, `theme.js`, `AppRoutes.jsx`, `MainLayout` + `AppHeader` + `AppSidebar`.
- `NotFoundPage` (smallest page — good smoke test for routing).

### Phase 6 — Frontend Task CRUD Flows (Day 8–10)
- `taskService.js`, `useTasks`/`useTask` hooks.
- `TaskListPage` + `TaskTable`/`TaskCard` + `TaskSearchBar` + `TaskFilterBar`.
- `TaskForm` (shared) → `AddTaskPage` → `EditTaskPage`.
- `TaskDetailsPage` + `ConfirmDialog` delete flow.

### Phase 7 — Dashboard (Day 11)
- `dashboardService.js`, `useDashboardSummary`.
- `SummaryCard`, `CompletionChart`, `UpcomingDeadlinesList` → `DashboardPage`.

### Phase 8 — Polish & Integration Testing (Day 12–13)
- Loading/empty/error states across all pages (`LoadingSpinner`, `EmptyState`, `ErrorBanner`, `Snackbar`).
- Responsive QA at all breakpoints.
- End-to-end manual pass: create → appears in list/dashboard → edit → search/filter/sort → delete → 404 handling.

### Phase 9 — Documentation & Handoff (Day 14)
- Finalize `docs/architecture.md`, `docs/api-documentation.md`, ER diagram export.
- README with setup instructions (backend `.env`/properties, frontend `.env`, run commands).

---

## 7. GitHub Repository Structure & Conventions

```
main                    ← protected, always deployable
├── develop             ← integration branch
│   ├── feature/backend-task-crud
│   ├── feature/backend-dashboard
│   ├── feature/frontend-routing-layout
│   ├── feature/frontend-task-list
│   ├── feature/frontend-task-form
│   ├── feature/frontend-dashboard
│   └── fix/*
```

- **Commit convention:** Conventional Commits — `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- **PR flow:** feature branch → PR into `develop` → squash-merge → periodic `develop` → `main` release merge.
- **Issue tracking:** one GitHub Issue per roadmap phase item (Section 6), labeled `backend`/`frontend`/`docs`.
- Root `README.md` documents: prerequisites (Java 21, Node LTS, MySQL 8), setup steps for both sub-projects, how to run, and a link to `docs/api-documentation.md`.

---

## 8. Recommended Implementation Order (Cross-Stack)

This is the dependency-aware order — each item only depends on items above it:

1. `entity/Task.java`, `Priority.java`, `Status.java` *(nothing depends on anything else yet)*
2. `repository/TaskRepository.java` *(depends on #1)*
3. `dto/request/*`, `dto/response/*` *(independent of #1/#2, can be built in parallel)*
4. `mapper/TaskMapper.java` *(depends on #1 and #3)*
5. `exception/*` *(independent — can be built anytime before #7)*
6. `service/TaskService.java` interface *(depends on #3, conceptually on #1)*
7. `service/impl/TaskServiceImpl.java` *(depends on #2, #4, #5, #6)*
8. `config/CorsConfig.java`, `OpenApiConfig.java` *(independent, needed before frontend can call the API)*
9. `controller/TaskController.java` (+ dashboard controller) *(depends on #6, #7, #3)*
10. Backend tests *(depend on #7 and #9)*
11. `frontend/services/apiClient.js` *(independent — just needs backend's base URL/port, i.e., #8/#9 running)*
12. `frontend/services/taskService.js`, `dashboardService.js` *(depend on #11 and the finalized contract from #9)*
13. `frontend/hooks/*` *(depend on #12)*
14. `frontend/routes/AppRoutes.jsx`, `layouts/*` *(independent of the hooks — can be built in parallel with #11–13)*
15. `frontend/components/common/*` *(independent — pure presentational, build early and reuse everywhere)*
16. `frontend/components/tasks/*`, `components/dashboard/*` *(depend on #13 for data-bearing components, #15 for shared UI primitives)*
17. `frontend/pages/*` *(depend on #14, #16 — pages are composition, built last)*

**Practical build order for a solo developer/agent:** backend fully first (1→10), confirmed working via Postman/Swagger, *then* frontend (11→17) — this avoids building UI against a moving/unverified API contract.

---

## 9. File Dependency Summary Table

| File / Layer | Depends On |
|---|---|
| `TaskRepository` | `Task` entity |
| `TaskMapper` | `Task` entity, request/response DTOs |
| `TaskServiceImpl` | `TaskRepository`, `TaskMapper`, exception classes, `TaskService` interface |
| `TaskController` | `TaskService` interface, request/response DTOs |
| `GlobalExceptionHandler` | custom exception classes, `ErrorResponse` |
| Frontend `taskService.js` | `apiClient.js`, finalized backend API contract |
| Frontend hooks (`useTasks`, etc.) | corresponding `services/*.js` |
| Frontend pages | hooks, `components/tasks/*` or `components/dashboard/*`, `components/common/*` |
| `AppRoutes.jsx` | all page components |
| `MainLayout` | `AppHeader`, `AppSidebar`, `AppRoutes` |

---

## 10. Naming Conventions

**Backend (Java):**
- Packages: lowercase, singular (`entity`, `repository`, `service`, `controller`, `dto.request`, `dto.response`).
- Classes: `PascalCase`, suffixed by role — `TaskController`, `TaskServiceImpl`, `TaskCreateRequest`, `TaskResponse`, `ResourceNotFoundException`.
- Interfaces: no `I` prefix (`TaskService`, not `ITaskService`) — idiomatic Spring style, impl carries the `Impl` suffix instead.
- Methods: verb-first, camelCase (`createTask`, `getTaskById`, `deleteTask`).
- REST paths: plural nouns, kebab/lowercase (`/api/tasks`, `/api/dashboard/summary`).
- DB columns: `snake_case` (`task_name`, `created_at`); Java fields: `camelCase` (`taskName`, `createdAt`) — mapped automatically by Hibernate's default naming strategy.
- Enum constants: `UPPER_SNAKE_CASE` (`IN_PROGRESS`).

**Frontend (JavaScript/React):**
- Components/files: `PascalCase.jsx` (`TaskCard.jsx`, `DashboardPage.jsx`).
- Hooks: `camelCase` prefixed `use` (`useTasks.js`).
- Services/utils: `camelCase.js` (`taskService.js`, `dateUtils.js`).
- CSS-in-MUI: `sx` prop for one-offs; theme tokens for anything reused ≥2 places.
- Constants: `UPPER_SNAKE_CASE` exported from `utils/constants.js` (`PRIORITY_OPTIONS`).
- Route paths: lowercase, kebab-case if multi-word (`/tasks/new`).

---

## 11. Best Practices Checklist

**Backend**
- Controllers stay thin — zero business logic, only orchestration + status codes.
- Program to the `TaskService` interface everywhere outside `impl/` — enables mocking in `@WebMvcTest`.
- Never expose JPA entities directly in API responses — always go through `TaskMapper` → DTO.
- Use `@Enumerated(EnumType.STRING)` — never `ORDINAL`.
- Centralize error shape via `GlobalExceptionHandler` — no ad-hoc `try/catch` returning raw strings from controllers.
- Environment-specific config via Spring profiles (`dev`/`prod`), never hardcoded credentials in `application.properties`.
- Pagination (`Pageable`) on every list-returning endpoint from day one — retrofitting pagination later is painful.
- Validate at the DTO boundary (`@Valid` + Jakarta Bean Validation annotations); keep entity-level constraints as a second line of defense, not the only one.

**Frontend**
- Components stay presentational where possible; data-fetching logic lives in `hooks/`, not inside JSX components.
- Never call `axios` directly from a component — always go through `services/*.js`.
- One shared `TaskForm` for both create/edit — avoids duplicated validation/layout logic drifting out of sync.
- Debounce search input (300ms) to avoid firing a request per keystroke.
- Server-driven pagination/sorting/filtering (query params), not client-side slicing of a fully-fetched list — keeps the UI correct as data grows.
- Always show three states per async view: loading (`Skeleton`/`LoadingSpinner`), error (`ErrorBanner`), empty (`EmptyState`) — never leave a blank screen.
- Confirm destructive actions (`ConfirmDialog` before delete).

**Cross-cutting**
- Keep the API contract (Section 4.3) as the single source of truth; if it changes, update `docs/api-documentation.md` and the Postman collection in the same PR.
- Write Postman collection assertions (status code, response shape) so it can double as a lightweight regression suite, not just manual clicking.
- Commit `docs/schema.sql` even though Hibernate can auto-generate DDL in dev — production deploys should run reviewed SQL, not `ddl-auto=update`.

---

## 12. API Documentation Structure (`docs/api-documentation.md` outline)

```
1. Overview & Base URL
2. Authentication (N/A for v1 — note as future work)
3. Common Response Envelope (ApiResponse / ErrorResponse shapes)
4. Endpoints
   4.1 Create Task — POST /api/tasks
   4.2 Get All Tasks — GET /api/tasks
   4.3 Get Task By Id — GET /api/tasks/{id}
   4.4 Update Task — PUT /api/tasks/{id}
   4.5 Delete Task — DELETE /api/tasks/{id}
   4.6 Search Tasks — GET /api/tasks/search
   4.7 Filter Tasks — GET /api/tasks/filter
   4.8 Dashboard Summary — GET /api/dashboard/summary
   (Each: description, path/query/body params table, sample request, sample response, error cases)
5. Enum Reference (Priority, Status values)
6. Pagination & Sorting Conventions
7. Postman Collection Link
```

This mirrors what `OpenApiConfig.java` will auto-generate at `/v3/api-docs` / `/swagger-ui.html` — the hand-written markdown version is for the repo `docs/` folder and portfolio/README purposes, while Swagger stays the live, always-current reference during development.

---

*End of architecture document. No implementation code is included by design — each file above is scoped precisely enough to be implemented independently once the interfaces/contracts in Sections 4.3, 4.2 (DTOs), and 5.2 (hook/service signatures) are treated as fixed contracts.*
