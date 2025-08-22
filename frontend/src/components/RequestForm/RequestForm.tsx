import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import type { ServiceRequest } from '../../pages/types';

// Import logos
import citeLogo from '../../assets/logos/cite.png';
import casLogo from '../../assets/logos/cas.png';
import cbaLogo from '../../assets/logos/cba.png';
import cnahsLogo from '../../assets/logos/cnahs.png';
import ccjeLogo from '../../assets/logos/ccje.png';

type RequestFormProps = {
  user: { name: string };
  onSubmit: (request: ServiceRequest) => void;
};

const buildings = [
  { value: 'ML', label: 'Main Library (ML)' },
  { value: 'CL', label: 'Computing Laboratory (CL)' },
  { value: 'AB', label: 'Administration Building (AB)' },
  { value: 'SB', label: 'Science Building (SB)' },
  { value: 'EB', label: 'Engineering Building (EB)' },
];

const categories = [
  'Electrical Issues',
  'Plumbing',
  'HVAC/Air Conditioning',
  'Furniture Repair',
  'Cleaning',
  'IT/Network',
  'Security',
  'Other'
];

const departments = [
  { logo: citeLogo, title: "CITE", desc: "College of Information Technology Education" },
  { logo: casLogo, title: "CAS", desc: "College of Arts and Sciences" },
  { logo: cbaLogo, title: "CBA", desc: "College of Business Administration" },
  { logo: cnahsLogo, title: "CNAHS", desc: "College of Nursing and Allied Health Sciences" },
  { logo: ccjeLogo, title: "CCJE", desc: "College of Criminal Justice Education" },
];

export const RequestForm: React.FC<RequestFormProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    building: '',
    room: '',
    department: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const request: ServiceRequest = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
      building: formData.building,
      room: formData.room,
      location: `${formData.building} ${formData.room}`,
      department: formData.department,
      requestedBy: user.name,
      status: 'ongoing',
      requestedAt: new Date().toISOString(),
      id: ''
    };

    try {
      const res = await fetch('api/servicerequest/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Service request submitted successfully!');
        setFormData({ title: '', description: '', category: '', priority: '', building: '', room: '', department: '' });
        onSubmit(data.requests);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit request.');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white">
      <CardHeader>
        <CardTitle>Submit Service Request</CardTitle>
        <CardDescription>
          Request maintenance or support services from the General Service Department
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Request Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Building, Room, Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select
                value={formData.building}
                onValueChange={(value) => setFormData({ ...formData, building: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md">
                  {buildings.map((b) => (
                    <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room Number</Label>
              <Input
                id="room"
                placeholder="e.g., 403"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Department with logos */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg rounded-md">
                {departments.map((dept) => (
                  <SelectItem key={dept.title} value={dept.title}>
                    <div className="flex items-center space-x-2">
                      <img src={dept.logo} alt={dept.title} className="w-6 h-6 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm">{dept.title}</p>
                        <p className="text-xs text-gray-500">{dept.desc}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about the issue or request..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </CardContent>
    </Card>
  );
};
