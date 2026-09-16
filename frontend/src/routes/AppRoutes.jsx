import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage.jsx';
import TaskListPage from '../pages/TaskListPage.jsx';
import AddTaskPage from '../pages/AddTaskPage.jsx';
import TaskDetailsPage from '../pages/TaskDetailsPage.jsx';
import EditTaskPage from '../pages/EditTaskPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

/**
 * Application Routes Configuration.
 * Responsibility: Maps URL paths to page components per Section 5.3 of architecture:
 *  - `/` -> DashboardPage
 *  - `/tasks` -> TaskListPage
 *  - `/tasks/new` -> AddTaskPage
 *  - `/tasks/:id` -> TaskDetailsPage
 *  - `/tasks/:id/edit` -> EditTaskPage
 *  - `*` -> NotFoundPage (catch-all smoke test)
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/tasks" element={<TaskListPage />} />
      <Route path="/tasks/new" element={<AddTaskPage />} />
      <Route path="/tasks/:id" element={<TaskDetailsPage />} />
      <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
