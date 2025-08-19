import React from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RequestForm } from './RequestForm';
import { LostAndFound } from './LostAndFound';
import { Inventory } from './Inventory';
import { AdminTodoList } from './AdminTodoList';
import {
  FileText,
  Package2,
  Search,
  ClipboardList,
  Users,
  Building,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getDashboardContent = () => {
    switch (user.role) {
      case 'student':
        return (
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">
                <FileText className="mr-2 h-4 w-4" />
                Submit Request
              </TabsTrigger>
              <TabsTrigger value="lost-found">
                <Search className="mr-2 h-4 w-4" />
                Lost & Found
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {user.name}</CardTitle>
                  <CardDescription>
                    Submit service requests to the General Service Department
                  </CardDescription>
                </CardHeader>
              </Card>
              <RequestForm />
            </TabsContent>
            
            <TabsContent value="lost-found">
              <LostAndFound />
            </TabsContent>
          </Tabs>
        );

      case 'teacher':
        return (
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="request">
                <FileText className="mr-2 h-4 w-4" />
                Submit Request
              </TabsTrigger>
              <TabsTrigger value="lost-found">
                <Search className="mr-2 h-4 w-4" />
                Lost & Found
              </TabsTrigger>
              <TabsTrigger value="inventory">
                <Package2 className="mr-2 h-4 w-4" />
                View Inventory
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {user.name}</CardTitle>
                  <CardDescription>
                    Faculty portal for service requests and facility management
                  </CardDescription>
                </CardHeader>
              </Card>
              <RequestForm />
            </TabsContent>
            
            <TabsContent value="lost-found">
              <LostAndFound />
            </TabsContent>
            
            <TabsContent value="inventory">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Overview</CardTitle>
                    <CardDescription>
                      View available GSD resources and equipment
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Inventory />
              </div>
            </TabsContent>
          </Tabs>
        );

      case 'admin':
        return (
          <Tabs defaultValue="todo" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todo">
                <ClipboardList className="mr-2 h-4 w-4" />
                Task Management
              </TabsTrigger>
              <TabsTrigger value="requests">
                <FileText className="mr-2 h-4 w-4" />
                All Requests
              </TabsTrigger>
              <TabsTrigger value="inventory">
                <Package2 className="mr-2 h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="lost-found">
                <Search className="mr-2 h-4 w-4" />
                Lost & Found
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="todo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {user.name}</CardTitle>
                  <CardDescription>
                    Administrative portal for managing GSD operations
                  </CardDescription>
                </CardHeader>
              </Card>
              <AdminTodoList />
            </TabsContent>
            
            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Service Requests</CardTitle>
                  <CardDescription>
                    View and manage all incoming service requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Sample Request #{i}</h4>
                          <p className="text-sm text-muted-foreground">CL 40{i} - HVAC Issues</p>
                          <p className="text-xs text-muted-foreground">Submitted 2 days ago</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Medium</Badge>
                          <Badge variant="destructive">Ongoing</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inventory">
              <Inventory />
            </TabsContent>
            
            <TabsContent value="lost-found">
              <LostAndFound />
            </TabsContent>
          </Tabs>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-xl font-semibold">GSD Portal</h1>
                <p className="text-sm text-muted-foreground">General Service Department</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getDashboardContent()}
      </main>
    </div>
  );
};