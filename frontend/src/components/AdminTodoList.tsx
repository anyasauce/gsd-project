import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle, Clock, XCircle, Plus, MoreVertical, MapPin } from 'lucide-react';
import { toast } from 'sonner';

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

// Mock todo data
const mockTodos: TodoItem[] = [
  {
    id: '1',
    title: 'Fix broken air conditioning',
    description: 'AC unit not working properly in lecture hall',
    location: 'CL 403',
    building: 'CL',
    room: '403',
    priority: 'high',
    status: 'ongoing',
    assignedTo: 'Maintenance Team A',
    createdAt: '2025-01-15',
    dueDate: '2025-01-17',
    category: 'HVAC'
  },
  {
    id: '2',
    title: 'Replace damaged chairs',
    description: 'Several chairs in the library are damaged and need replacement',
    location: 'ML 201',
    building: 'ML',
    room: '201',
    priority: 'medium',
    status: 'done',
    assignedTo: 'Facilities Team',
    createdAt: '2025-01-14',
    dueDate: '2025-01-20',
    category: 'Furniture'
  },
  {
    id: '3',
    title: 'Network connectivity issues',
    description: 'Internet connection problems reported by multiple users',
    location: 'SB 105',
    building: 'SB',
    room: '105',
    priority: 'urgent',
    status: 'ongoing',
    assignedTo: 'IT Department',
    createdAt: '2025-01-13',
    dueDate: '2025-01-15',
    category: 'IT'
  },
  {
    id: '4',
    title: 'Deep cleaning request',
    description: 'Scheduled deep cleaning after construction work',
    location: 'AB 301',
    building: 'AB',
    room: '301',
    priority: 'low',
    status: 'no action',
    assignedTo: 'Cleaning Staff',
    createdAt: '2025-01-12',
    dueDate: '2025-01-25',
    category: 'Cleaning'
  }
];

const buildings = [
  { value: 'ML', label: 'Main Library (ML)' },
  { value: 'CL', label: 'Computing Laboratory (CL)' },
  { value: 'AB', label: 'Administration Building (AB)' },
  { value: 'SB', label: 'Science Building (SB)' },
  { value: 'EB', label: 'Engineering Building (EB)' },
];

const teams = [
  'Maintenance Team A',
  'Maintenance Team B',
  'Facilities Team',
  'IT Department',
  'Cleaning Staff',
  'Security Team'
];

const categories = ['HVAC', 'Electrical', 'Plumbing', 'Furniture', 'IT', 'Cleaning', 'Security', 'Other'];

export const AdminTodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    building: '',
    room: '',
    priority: 'medium' as TodoItem['priority'],
    assignedTo: '',
    dueDate: '',
    category: ''
  });

  const getStatusIcon = (status: TodoItem['status']) => {
    switch (status) {
      case 'ongoing': return <Clock className="h-4 w-4" />;
      case 'done': return <CheckCircle className="h-4 w-4" />;
      case 'no action': return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: TodoItem['status']) => {
    switch (status) {
      case 'ongoing': return 'secondary';
      case 'done': return 'default';
      case 'no action': return 'destructive';
    }
  };

  const getPriorityColor = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
    }
  };

  const updateTodoStatus = (id: string, status: TodoItem['status']) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, status } : todo
    ));
    toast.success(`Task status updated to ${status}`);
  };

  const handleAddTodo = () => {
    const todo: TodoItem = {
      id: Date.now().toString(),
      ...newTodo,
      location: `${newTodo.building} ${newTodo.room}`,
      status: 'ongoing',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTodos([todo, ...todos]);
    toast.success('New task added successfully!');
    setIsAddDialogOpen(false);
    setNewTodo({
      title: '',
      description: '',
      building: '',
      room: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      category: ''
    });
  };

  const todosByStatus = {
    ongoing: todos.filter(todo => todo.status === 'ongoing'),
    done: todos.filter(todo => todo.status === 'done'),
    'no action': todos.filter(todo => todo.status === 'no action')
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateTodoStatus(todo.id, 'ongoing')}>
                  Mark as Ongoing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateTodoStatus(todo.id, 'done')}>
                  Mark as Done
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateTodoStatus(todo.id, 'no action')}>
                  Mark as No Action
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
            <Badge variant={getStatusColor(todo.status)}>
              {todo.status}
            </Badge>
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
          <p className="text-muted-foreground">Manage and track GSD tasks and requests</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
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
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTodo.category}
                    onValueChange={(value) => setNewTodo({ ...newTodo, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building">Building</Label>
                  <Select
                    value={newTodo.building}
                    onValueChange={(value) => setNewTodo({ ...newTodo, building: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building.value} value={building.value}>
                          {building.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    placeholder="e.g., 403"
                    value={newTodo.room}
                    onChange={(e) => setNewTodo({ ...newTodo, room: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTodo.priority}
                    onValueChange={(value: TodoItem['priority']) => setNewTodo({ ...newTodo, priority: value })}
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
                  <Label htmlFor="assigned">Assign To</Label>
                  <Select
                    value={newTodo.assignedTo}
                    onValueChange={(value) => setNewTodo({ ...newTodo, assignedTo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTodo}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todosByStatus.ongoing.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todosByStatus.done.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Action Needed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todosByStatus['no action'].length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ongoing">Ongoing ({todosByStatus.ongoing.length})</TabsTrigger>
          <TabsTrigger value="done">Done ({todosByStatus.done.length})</TabsTrigger>
          <TabsTrigger value="no action">No Action ({todosByStatus['no action'].length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ongoing" className="mt-6">
          <div className="space-y-4">
            {todosByStatus.ongoing.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
            {todosByStatus.ongoing.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No ongoing tasks at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="done" className="mt-6">
          <div className="space-y-4">
            {todosByStatus.done.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
            {todosByStatus.done.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed tasks yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="no action" className="mt-6">
          <div className="space-y-4">
            {todosByStatus['no action'].map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
            {todosByStatus['no action'].length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks marked as no action needed.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};