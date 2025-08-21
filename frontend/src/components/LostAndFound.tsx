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
import { Search, Package, MapPin, Image as ImageIcon } from 'lucide-react';


interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  dateReported: string;
  status: 'lost' | 'found' | 'returned';
  reportedBy: string;
  image?: string; // new field for image (base64 or URL)
}

const mockItems: LostFoundItem[] = [
  {
    id: '1',
    title: 'Blue Water Bottle',
    description: 'Stainless steel water bottle with university logo',
    category: 'Personal Items',
    location: 'CL 201',
    dateReported: '2025-01-15',
    status: 'found',
    reportedBy: 'GSD Staff',
    image: '' // optional demo image
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
    type: 'lost' as 'lost' | 'found',
    image: '' // base64 string
  });

  const categories = ['Electronics', 'Personal Items', 'Bags', 'Clothing', 'Books', 'Keys', 'Other'];

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
      type: 'lost',
      image: ''
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
        
       {/* Browse Items */}
<TabsContent value="browse" className="space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {filteredItems.map((item) => (
      <Card
        key={item.id}
        className="rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
      >
        {/* Image */}
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}

        {/* Content */}
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base font-semibold truncate">
              {item.title}
            </CardTitle>
            <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
          </div>
          <CardDescription className="flex items-center gap-1 text-xs mt-1">
            <MapPin className="h-3 w-3" />
            {item.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {item.description}
          </p>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{item.category}</span>
            <span>{item.dateReported}</span>
          </div>
          <Button className="w-full mt-3" size="sm">
            View Details
          </Button>
        </CardContent>
      </Card>
    ))}

    {filteredItems.length === 0 && (
      <div className="text-center py-8 text-muted-foreground col-span-full">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No items found matching your search.</p>
      </div>
    )}
  </div>
</TabsContent>

        
        {/* Report Form */}
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
                    <Label>Report Type</Label>
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
                    <Label>Item Title</Label>
                    <Input
                      placeholder="e.g., Blue Water Bottle"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
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
                    <Label>Location</Label>
                    <Input
                      placeholder="e.g., CL 403, ML 201"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Provide detailed description of the item..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Image (optional)</Label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover mt-2 rounded-lg border" 
                    />
                  )}
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
