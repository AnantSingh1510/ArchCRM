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
import { Plus, Trash2 } from 'lucide-react';

export default function NewPaymentPlanPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    details: {
      downPayment: 0,
      installments: [] as { amount: number; dueDate: string }[],
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:3000/project', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: parseFloat(value),
      },
    }));
  };

  const handleInstallmentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const installments = [...formData.details.installments];
    installments[index] = { ...installments[index], [name]: value };
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        installments,
      },
    }));
  };

  const addInstallment = () => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        installments: [...prev.details.installments, { amount: 0, dueDate: '' }],
      },
    }));
  };

  const removeInstallment = (index: number) => {
    const installments = [...formData.details.installments];
    installments.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        installments,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post('http://localhost:3000/payment-plans', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/dashboard/admin/payment-plans');
    } catch (error) {
      console.error('Failed to create payment plan:', error);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">New Payment Plan</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Payment Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Select name="projectId" onValueChange={(v) => handleSelectChange('projectId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Down Payment (%)</Label>
              <Input name="downPayment" type="number" value={formData.details.downPayment} onChange={handleDetailsChange} />
            </div>
            <div className="space-y-2">
              <Label>Installments</Label>
              {formData.details.installments.map((inst: any, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    value={inst.amount}
                    onChange={(e) => handleInstallmentChange(index, e)}
                  />
                  <Input
                    name="dueDate"
                    type="date"
                    placeholder="Due Date"
                    value={inst.dueDate}
                    onChange={(e) => handleInstallmentChange(index, e)}
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeInstallment(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addInstallment}>
                <Plus className="w-4 h-4 mr-2" />
                Add Installment
              </Button>
            </div>
            <Button type="submit">Create Payment Plan</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
