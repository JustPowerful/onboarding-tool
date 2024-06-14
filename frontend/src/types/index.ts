export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
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
}

export type WorkspaceTab = "BOARD" | "CLIENTS" | "SETTINGS";
