import React, { createContext, useContext } from 'react';

/**
 * Task Context.
 * Responsibility: Optional global task context if cross-cutting shared state is needed without prop drilling.
 */
const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  // TODO: Provide task state and handler functions if global state is required
  return <TaskContext.Provider value={{}}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  return useContext(TaskContext);
}

export default TaskContext;
