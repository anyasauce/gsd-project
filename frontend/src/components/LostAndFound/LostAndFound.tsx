import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Package, MapPin, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { LostFoundModal } from './LostFoundModal';
import { useAuth } from '../../pages/context/AuthContext';

interface LostFoundItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  dateReported: string;
  status: 'lost' | 'found' | 'returned';
  reportedBy: string;
  image?: string;
}

export const LostAndFound: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role ?? 'user';

  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    type: 'lost' as 'lost' | 'found',
    image: ''
  });

  const categories = ['Electronics', 'Personal Items', 'Bags', 'Clothing', 'Books', 'Keys', 'Other'];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('api/lostfound/lost-found-items', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch items');
      }
    };

    fetchItems();
    const interval = setInterval(fetchItems, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = (item: LostFoundItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: number, status: LostFoundItem['status']) => {
    try {
      const res = await fetch(`api/lostfound/update-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setItems(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
        toast.success('Status updated!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const res = await fetch(`/api/lostfound/delete-item/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Item deleted successfully");
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting");
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        status: formData.type, // lost or found
        image: formData.image,
      };

      const res = await fetch('/api/lostfound/add-lost-found-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });

      if (res.ok) {
        toast.success(`${formData.type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`);

        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          type: 'lost',
          image: ''
        });

        const fetchRes = await fetch('api/lostfound/lost-found-items', { credentials: 'include' });
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          setItems(data.items || data);
        }
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to report item');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost': return 'secondary';
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
          {role === 'student' && <TabsTrigger value="report">Report Item</TabsTrigger>}
        </TabsList>
        
        {/* Browse Items */}
        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.length > 0 ? filteredItems
              .filter(item => {
                // if logged-in user is student, hide returned items
                if (user?.role === "student") {
                  return item.status !== "returned";
                }
                return true; // admins/mods see everything
              })
              .map(item => (
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
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                      <span>{item.category}</span>
                      <span>{item.dateReported}</span>
                    </div>
                    <Button className="w-full mt-3" size="sm" onClick={() => handleViewDetails(item)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              )) : (
              <div className="text-center py-8 text-muted-foreground col-span-full">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items found matching your search.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Report Form - Only visible for students */}
        {role === 'student' && (
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
        )}
      </Tabs>

      {selectedItem && (
        <LostFoundModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
          role={role === 'student' ? 'user' : role as 'admin' | 'user'}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  );
};