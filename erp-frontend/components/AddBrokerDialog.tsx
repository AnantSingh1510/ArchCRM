"use client";

import { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddBrokerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBrokerAdded: (newBroker: any) => void;
}

export default function AddBrokerDialog({ isOpen, onClose, onBrokerAdded }: AddBrokerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.post("http://localhost:3000/broker", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 201) {
        onBrokerAdded(res.data);
        onClose();
      } else {
        setError("Failed to add broker");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Broker</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Broker</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
