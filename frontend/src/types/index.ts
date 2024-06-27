export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: "MANAGER" | "EMPLOYEE" | "CLIENT" | "SUPERADMIN";
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

export interface Proposal {
  id: number;
  name: string;
  description: string;
  stack?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId: number;
  taskId: number;
  user: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: "MANAGER" | "EMPLOYEE" | "CLIENT";
  };
}

export type WorkspaceTab = "BOARD" | "CLIENTS" | "SETTINGS";
