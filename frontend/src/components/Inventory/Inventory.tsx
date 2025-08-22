import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Search, Plus, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minStock: number; // frontend expects this
  location: string;
  supplier: string;
  lastUpdated: string; // frontend expects this
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}


const categories = ['Furniture', 'Electrical', 'Maintenance', 'IT Equipment', 'Tools', 'Safety', 'Other'];

export const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    minStock: 0,
    location: '',
    supplier: ''
  });

  const fetchInventory = async () => {
  try {
    const res = await fetch('/api/inventory/inventory', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedData: InventoryItem[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      minStock: item.min_stock,
      location: item.location,
      supplier: item.supplier,
      lastUpdated: item.last_updated,
      status: item.status
    }));

    setInventory(mappedData);
  } catch (err) {
    console.error(err);
    toast.error('Failed to fetch inventory');
  }
};

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 1000); // refresh every 1 second
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'default';
      case 'low-stock': return 'secondary';
      case 'out-of-stock': return 'destructive';
      default: return 'secondary';
    }
  };

  const getItemStatus = (quantity: number, minStock: number): InventoryItem['status'] => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= minStock) return 'low-stock';
    return 'in-stock';
  };

  const handleAddItem = async () => {
    try {
      const itemToAdd = {
        ...newItem,
        status: getItemStatus(newItem.quantity, newItem.minStock)
      };
      const res = await fetch('/api/inventory/add-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToAdd),
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('Inventory item added successfully!');
        setNewItem({ name: '', category: '', quantity: 0, minStock: 0, location: '', supplier: '' });
        fetchInventory();
        setIsAddDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to add item');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error while adding item');
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{inventory.length}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventory.filter(item => item.status === 'in-stock').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventory.filter(item => item.status === 'out-of-stock').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>Add a new item to inventory</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newItem.category} onValueChange={value => setNewItem({ ...newItem, category: value })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Min Stock</Label>
                  <Input type="number" value={newItem.minStock} onChange={e => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={newItem.location} onChange={e => setNewItem({ ...newItem, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Input value={newItem.supplier} onChange={e => setNewItem({ ...newItem, supplier: e.target.value })} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage and track inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.quantity} {item.quantity <= item.minStock && item.quantity > 0 && `(Min: ${item.minStock})`}
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell><Badge variant={getStatusColor(item.status)}>{item.status.replace('-', ' ')}</Badge></TableCell>
                  <TableCell>{item.lastUpdated.split('T')[0]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInventory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No inventory items found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
