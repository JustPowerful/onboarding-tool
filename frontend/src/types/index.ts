export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: "MANAGER" | "EMPLOYEE" | "CLIENT";
}

export interface WorkspaceData {
  id: number;
  name: string;
}

export interface ChecklistData {
  id: number;
  name: string;
  workspaceId: number;
  tasks: TaskData[];
}

export interface TaskData {
  id: number;
  name: string;
  description?: string;
  checklistId: number;
  assignements?: Assignment[];
}

export interface Assignment {
  id: number;
  taskId: number;
  userId: number;
}

export type WorkspaceTab = "BOARD" | "CLIENTS" | "SETTINGS";
