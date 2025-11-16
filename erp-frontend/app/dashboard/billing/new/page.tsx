"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:3000/client', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post('http://localhost:3000/approval', {
        type: 'INVOICE',
        data: {
          ...formData,
          amount: parseFloat(formData.amount),
        },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/dashboard/billing');
    } catch (error) {
      console.error('Failed to create invoice approval request:', error);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">New Invoice</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select name="clientId" onValueChange={(v) => handleSelectChange('clientId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input name="amount" type="number" value={formData.amount} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} />
            </div>
            <Button type="submit">Create Invoice</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
