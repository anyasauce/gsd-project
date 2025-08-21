// types.ts
export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  building: string;
  room: string;
  location: string;
  department: string;
  requestedBy: string;
  requestedAt: string;
  status: 'ongoing' | 'done' | 'no action'; // <- changed to match your dashboard
}



export interface TodoItem {
  id: string;
  title: string;
  description: string;
  location: string;
  building: string;
  room: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'ongoing' | 'done' | 'no action';
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  category: string;
}
