export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface AssignedEmployee {
  id: string;
  name: string;
  role: string;
  documentStatus: "complete" | "pending";
}

export interface AssignedTool {
  id: string;
  name: string;
  type: "tool" | "furniture";
  allocatedQty: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  phase: "no_event" | "during" | "post";
  startDate: string;
  completionRate: number;
  checklist: ChecklistItem[];
  assignedEmployees: AssignedEmployee[];
  assignedTools: AssignedTool[];
  hotelName: string;
  hotelCheckin: string;
  flightDetails: string;
  docs: { id: string; name: string; status: "pending" | "approved" | "uploaded" }[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  documentStatus: "complete" | "pending";
  hasSafetyCert: boolean;
}

export interface WarehouseItem {
  id: string;
  name: string;
  type: "tool" | "furniture";
  stock: number;
}

export interface InvoiceLog {
  id: string;
  vendor: string;
  invoiceNumber: string;
  value: number;
  description: string;
  date: string;
}
