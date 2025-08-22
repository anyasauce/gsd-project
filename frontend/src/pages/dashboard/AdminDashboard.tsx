import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { AdminTodoList } from "../../components/AdminTodoList/AdminTodoList";
import { Inventory } from "../../components/Inventory/Inventory";
import { LostAndFound } from "../../components/LostAndFound/LostAndFound";
import { Button } from "../../components/ui/button";
import {
  ClipboardList,
  FileText,
  Package2,
  Search,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

import citeLogo from "../../assets/logos/cite.png";
import casLogo from "../../assets/logos/cas.png";
import cbaLogo from "../../assets/logos/cba.png";
import cnahsLogo from "../../assets/logos/cnahs.png";
import ccjeLogo from "../../assets/logos/ccje.png";

import type { ServiceRequest } from "../../pages/types";

interface Props {
  userName: string;
  requests: ServiceRequest[];
}

export const AdminDashboard: React.FC<Props> = ({ userName, requests }) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<ServiceRequest>>({});

  const departments = [
    { title: "CITE", logo: citeLogo },
    { title: "CAS", logo: casLogo },
    { title: "CBA", logo: cbaLogo },
    { title: "CNAHS", logo: cnahsLogo },
    { title: "CCJE", logo: ccjeLogo },
  ];

  const openNewRequestModal = () => {
    setEditingRequest(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const openEditModal = (req: ServiceRequest) => {
    setEditingRequest(req);
    setFormData(req);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editingRequest) {
      try {
        const res = await fetch(
          `/api/servicerequest/requests/${editingRequest.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: formData.status }),
          }
        );

        const data = await res.json();
        console.log("Updated:", data);

        // TODO: update your local state if needed (replace the updated request in the list)
      } catch (err) {
        console.error("Update failed", err);
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/servicerequest/requests/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("Deleted:", data);
      // TODO: update requests list in state
      setIsModalOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  return (
    <Tabs defaultValue="todo" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="todo">
          <ClipboardList className="mr-2 h-4 w-4" /> Task Management
        </TabsTrigger>
        <TabsTrigger value="requests">
          <FileText className="mr-2 h-4 w-4" /> All Requests
        </TabsTrigger>
        <TabsTrigger value="inventory">
          <Package2 className="mr-2 h-4 w-4" /> Inventory
        </TabsTrigger>
        <TabsTrigger value="lost-found">
          <Search className="mr-2 h-4 w-4" /> Lost & Found
        </TabsTrigger>
      </TabsList>

      {/* Task Management */}
      <TabsContent
        value="todo"
        className="space-y-4 bg-white p-4 rounded-lg shadow"
      >
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Welcome, {userName}</CardTitle>
            <CardDescription>
              Administrative portal for managing GSD operations
            </CardDescription>
          </CardHeader>
        </Card>
        <AdminTodoList />
      </TabsContent>

      {/* Requests */}
      <TabsContent
        value="requests"
        className="space-y-6 bg-white p-4 rounded-lg shadow"
      >
        {!selectedDept ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <Card
                key={dept.title}
                onClick={() => setSelectedDept(dept.title)}
                className="cursor-pointer hover:shadow-lg p-4 flex flex-col items-center text-center"
              >
                <img
                  src={dept.logo}
                  alt={dept.title}
                  className="w-16 h-16 mb-2"
                />
                <p className="font-semibold">{dept.title}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => setSelectedDept(null)}>
                ← Back to Departments
              </Button>
              <Button onClick={openNewRequestModal}>
                <Plus className="mr-2 h-4 w-4" /> Add Request
              </Button>
            </div>
            {requests.filter(
              (r) => r.department?.toLowerCase() === selectedDept.toLowerCase()
            ).length === 0 ? (
              <p className="text-sm text-muted-foreground mt-4">
                No requests for this department.
              </p>
            ) : (
              <div className="grid gap-4">
                {requests
                  .filter(
                    (r) =>
                      r.department?.toLowerCase() === selectedDept.toLowerCase()
                  )
                  .map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-col border-l-4 border-primary bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">{req.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => openEditModal(req)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(Number(req.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {req.location} ({req.building} - {req.room})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted by: {req.requestedBy}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </TabsContent>

      {/* Inventory */}
      <TabsContent value="inventory">
        <Inventory />
      </TabsContent>

      {/* Lost & Found */}
      <TabsContent value="lost-found">
        <LostAndFound />
      </TabsContent>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingRequest
            ? `Edit Request - ID ${editingRequest.id}`
            : "Add New Request"
        }
      >
        <div className="space-y-4 text-gray-800">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title || ""} readOnly />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description || ""}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={formData.location || ""} readOnly />
          </div>
          <div>
            <Label htmlFor="building">Building</Label>
            <Input id="building" value={formData.building || ""} readOnly />
          </div>
          <div>
            <Label htmlFor="room">Room</Label>
            <Input id="room" value={formData.room || ""} readOnly />
          </div>

          {/* Only editable field: Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || "ongoing"}
              onValueChange={(value: "ongoing" | "done" | "no action") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-4 flex justify-end gap-2">
          {/* Show Delete button only in edit mode */}
          {editingRequest && (
            <Button onClick={() => handleDelete(Number(editingRequest.id))}>
              Delete
            </Button>
          )}

          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>

          {/* Show Update button only in edit mode */}
          {editingRequest && (
            <Button onClick={handleSave}>Update Status</Button>
          )}
        </div>
      </Modal>
    </Tabs>
  );
};
