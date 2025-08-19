import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Search, Package, MapPin } from 'lucide-react';

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  dateReported: string;
  status: 'lost' | 'found' | 'returned';
  reportedBy: string;
}

// Mock data for demonstration
const mockItems: LostFoundItem[] = [
  {
    id: '1',
    title: 'Blue Water Bottle',
    description: 'Stainless steel water bottle with university logo',
    category: 'Personal Items',
    location: 'CL 201',
    dateReported: '2025-01-15',
    status: 'found',
    reportedBy: 'GSD Staff'
  },
  {
    id: '2',
    title: 'iPhone 13',
    description: 'Black iPhone with cracked screen protector',
    category: 'Electronics',
    location: 'ML 403',
    dateReported: '2025-01-14',
    status: 'lost',
    reportedBy: 'John Student'
  },
  {
    id: '3',
    title: 'Red Backpack',
    description: 'Red Jansport backpack with physics textbooks',
    category: 'Bags',
    location: 'SB 105',
    dateReported: '2025-01-13',
    status: 'returned',
    reportedBy: 'Jane Teacher'
  }
];

export const LostAndFound: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    type: 'lost' as 'lost' | 'found'
  });

  const categories = ['Electronics', 'Personal Items', 'Bags', 'Clothing', 'Books', 'Keys', 'Other'];

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: LostFoundItem = {
      id: Date.now().toString(),
      ...formData,
      dateReported: new Date().toISOString().split('T')[0],
      status: formData.type,
      reportedBy: 'Current User'
    };

    setItems([newItem, ...items]);
    toast.success(`${formData.type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`);
    
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      type: 'lost'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost': return 'destructive';
      case 'found': return 'secondary';
      case 'returned': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
          <TabsTrigger value="report">Report Item</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3" />
                        {item.location} • {item.dateReported}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Category: {item.category}</span>
                    <span>Reported by: {item.reportedBy}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items found matching your search.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle>Report Lost or Found Item</CardTitle>
              <CardDescription>
                Help us keep track of lost and found items on campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'lost' | 'found') => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lost">Lost Item</SelectItem>
                        <SelectItem value="found">Found Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-title">Item Title</Label>
                    <Input
                      id="item-title"
                      placeholder="e.g., Blue Water Bottle"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
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
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., CL 403, ML 201"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    placeholder="Provide detailed description of the item..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Report {formData.type === 'lost' ? 'Lost' : 'Found'} Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};