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
  clients: Client[];
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

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  workspaces: {
    id: number;
    workspace: {
      id: number;
      name: string;
    };
    status: "INSCRIBED" | "PENDING";
  }[];
}

export type WorkspaceTab = "BOARD" | "CLIENTS" | "SETTINGS";
