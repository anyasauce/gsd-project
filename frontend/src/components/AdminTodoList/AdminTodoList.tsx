import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  MoreVertical,
  MapPin,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export interface TodoItem {
  id: number;
  title: string;
  description: string;
  location: string;
  building: string;
  room: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "ongoing" | "done" | "no action";
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  category: string;
}

const buildings = [
  { value: "ML", label: "Main Library (ML)" },
  { value: "CL", label: "Computing Laboratory (CL)" },
  { value: "AB", label: "Administration Building (AB)" },
  { value: "SB", label: "Science Building (SB)" },
  { value: "EB", label: "Engineering Building (EB)" },
];

const teams = [
  "Maintenance Team A",
  "Maintenance Team B",
  "Facilities Team",
  "IT Department",
  "Cleaning Staff",
  "Security Team",
];

const categories = [
  "HVAC",
  "Electrical",
  "Plumbing",
  "Furniture",
  "IT",
  "Cleaning",
  "Security",
  "Other",
];

export const AdminTodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [newTodo, setNewTodo] = useState<
    Omit<TodoItem, "id" | "status" | "createdAt" | "location">
  >({
    title: "",
    description: "",
    building: "",
    room: "",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
    category: "",
  });

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = data.map((todo: any) => ({
        ...todo,
        assignedTo: todo.assigned_to,
        dueDate: todo.due_date,
        createdAt: todo.created_at,
      }));
      setTodos(mapped); // update todos, this won't touch dropdownOpenId
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
    const interval = setInterval(fetchTodos, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTodo = async () => {
    try {
      const todoToSend = {
        title: newTodo.title,
        description: newTodo.description,
        building: newTodo.building,
        room: newTodo.room,
        location: `${newTodo.building} ${newTodo.room}`,
        priority: newTodo.priority,
        assigned_to: newTodo.assignedTo,
        due_date: newTodo.dueDate,
        status: "ongoing",
        category: newTodo.category,
      };

      const res = await fetch("api/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoToSend),
      });

      if (!res.ok) throw new Error("Failed to add todo");
      toast.success("Task added successfully");
      setNewTodo({
        title: "",
        description: "",
        building: "",
        room: "",
        priority: "medium",
        assignedTo: "",
        dueDate: "",
        category: "",
      });
      setIsAddDialogOpen(false);
      fetchTodos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    }
  };

  const handleUpdateStatus = async (id: number, status: TodoItem["status"]) => {
    try {
      const res = await fetch(`api/todos/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Task status updated to ${status}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`api/todos/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      toast.success("Task deleted successfully");
      fetchTodos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  const getStatusColor = (status: TodoItem["status"]) => {
    switch (status) {
      case "ongoing":
        return "secondary";
      case "done":
        return "default";
      case "no action":
        return "destructive";
    }
  };

  const getStatusIcon = (status: TodoItem["status"]) => {
    switch (status) {
      case "ongoing":
        return <Clock className="h-4 w-4" />;
      case "done":
        return <CheckCircle className="h-4 w-4" />;
      case "no action":
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: TodoItem["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
    }
  };

  const todosByStatus = {
    ongoing: todos.filter((t) => t.status === "ongoing"),
    done: todos.filter((t) => t.status === "done"),
    "no action": todos.filter((t) => t.status === "no action"),
  };

  const TodoCard = ({ todo }: { todo: TodoItem }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{todo.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3" />
              {todo.location} • Due: {todo.dueDate}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(todo.priority)}>
              {todo.priority}
            </Badge>
            <DropdownMenu
              open={dropdownOpenId === todo.id}
              onOpenChange={(open) => setDropdownOpenId(open ? todo.id : null)}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(todo.id, "ongoing")}
                >
                  Mark as Ongoing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(todo.id, "done")}
                >
                  Mark as Done
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(todo.id, "no action")}
                >
                  Mark as No Action
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(todo.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{todo.description}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Category: {todo.category}</span>
            <span>Assigned: {todo.assignedTo}</span>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(todo.status)}
            <Badge variant={getStatusColor(todo.status)}>{todo.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admin Task Management</h2>
          <p className="text-muted-foreground">
            Manage and track GSD tasks and requests
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task for the GSD team to handle.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newTodo.title}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newTodo.category}
                    onValueChange={(v) =>
                      setNewTodo({ ...newTodo, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Building</Label>
                  <Select
                    value={newTodo.building}
                    onValueChange={(v) =>
                      setNewTodo({ ...newTodo, building: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Room</Label>
                  <Input
                    value={newTodo.room}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, room: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTodo.priority}
                    onValueChange={(v) =>
                      setNewTodo({
                        ...newTodo,
                        priority: v as TodoItem["priority"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Select
                    value={newTodo.assignedTo}
                    onValueChange={(v) =>
                      setNewTodo({ ...newTodo, assignedTo: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTodo}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ongoing">
            Ongoing ({todosByStatus.ongoing.length})
          </TabsTrigger>
          <TabsTrigger value="done">
            Done ({todosByStatus.done.length})
          </TabsTrigger>
          <TabsTrigger value="no action">
            No Action ({todosByStatus["no action"].length})
          </TabsTrigger>
        </TabsList>

        {(["ongoing", "done", "no action"] as const).map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="space-y-4">
              {todosByStatus[status].map((todo) => (
                <TodoCard key={todo.id} todo={todo} />
              ))}
              {todosByStatus[status].length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {status === "ongoing" && (
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  )}
                  {status === "done" && (
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  )}
                  {status === "no action" && (
                    <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  )}
                  <p>No tasks in this category.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
