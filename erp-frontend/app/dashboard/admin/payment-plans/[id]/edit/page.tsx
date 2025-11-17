"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from '@/context/auth-context';

interface FormDataState {
  projectId: string;
  planName: string;
  planType: string;
  roi: number;
  emiCycle: string;
  type: string;
  timelyDiscount: boolean;
  discountPerArea: number;
  discountPercentage: number;
  discountCalculate: string;
  description: string;
  attachment: File | null;
}

const planTypes = ["Construction Plan", "Down Payment Plan", "Flexi Plan", "Time Plan", "Emi Plan"];
const emiCycles = ["Monthly", "Quarterly", "Half-Yearly", "Annually"];

export default function EditPaymentPlanPage() {
  const router = useRouter();
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState<FormDataState | null>(null);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/project', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, [token]);

  useEffect(() => {
    if (!id) return;
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/payment-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({ ...response.data, attachment: null });
      } catch (error) {
        console.error('Failed to fetch payment plan:', error);
      }
    };
    fetchPlan();
  }, [id, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => prev ? { ...prev, [name]: isNumber ? parseFloat(value) || 0 : value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => prev ? { ...prev, attachment: file } : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const postData = new FormData();
    const { attachment, timelyDiscount, ...otherFields } = formData;
    if (attachment) {
      postData.append('attachment', attachment);
    }
    postData.append('timelyDiscount', String(timelyDiscount));
    for (const [key, value] of Object.entries(otherFields)) {
      postData.append(key, String(value));
    }

    try {
      await axios.patch(`http://localhost:3000/payment-plans/${id}`, postData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/dashboard/admin/payment-plans');
    } catch (error) {
      console.error('Failed to update payment plan:', error);
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Payment Plan</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Payment Plan Details</span>
              <span className="text-sm font-normal text-red-500">* Denotes mandatory fields</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Project <span className="text-red-500">*</span></Label>
              <Select name="projectId" value={formData.projectId} onValueChange={(v) => handleSelectChange('projectId', v)}>
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
              <Label>Plan Name <span className="text-red-500">*</span></Label>
              <Input name="planName" value={formData.planName} onChange={handleInputChange} placeholder="Plan Name" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Plan Type <span className="text-red-500">*</span></Label>
              <div className="flex flex-wrap gap-2">
                {planTypes.map(pt => (
                  <Button 
                    key={pt} 
                    type="button"
                    variant={formData.planType === pt ? "default" : "outline"}
                    onClick={() => setFormData(prev => prev ? {...prev, planType: pt} : null)}
                  >
                    {pt}
                  </Button>
                ))}
              </div>
            </div>

            {formData.planType === 'Emi Plan' && (
              <>
                <div className="space-y-2">
                  <Label>ROI(%) <span className="text-red-500">*</span></Label>
                  <Input name="roi" type="number" value={formData.roi} onChange={handleInputChange} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Emi Cycle <span className="text-red-500">*</span></Label>
                  <div className="flex flex-wrap gap-2">
                    {emiCycles.map(cycle => (
                      <Button 
                        key={cycle} 
                        type="button"
                        variant={formData.emiCycle === cycle ? "default" : "outline"}
                        onClick={() => setFormData(prev => prev ? {...prev, emiCycle: cycle} : null)}
                      >
                        {cycle}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {formData.planType !== 'Construction Plan' && (
              <div className="space-y-2">
                <Label>Type <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Button type="button" variant={formData.type === '%' ? "default" : "outline"} onClick={() => setFormData(prev => prev ? {...prev, type: '%'} : null)}>%</Button>
                  <Button type="button" variant={formData.type === 'Fix' ? "default" : "outline"} onClick={() => setFormData(prev => prev ? {...prev, type: 'Fix'} : null)}>Fix</Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Timely Discount <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <Button type="button" variant={!formData.timelyDiscount ? "default" : "outline"} onClick={() => setFormData(prev => prev ? {...prev, timelyDiscount: false} : null)}>No</Button>
                <Button type="button" variant={formData.timelyDiscount ? "default" : "outline"} onClick={() => setFormData(prev => prev ? {...prev, timelyDiscount: true} : null)}>Yes</Button>
              </div>
            </div>

            {formData.timelyDiscount && (
              <>
                <div className="space-y-2">
                  <Label>Discount(Per Area)</Label>
                  <Input name="discountPerArea" type="number" value={formData.discountPerArea} onChange={handleInputChange} placeholder="Discount(Per Area)" />
                </div>
                {formData.planType === 'Down Payment Plan' && (
                  <>
                    <div className="space-y-2">
                      <Label>Discount(%)</Label>
                      <Input name="discountPercentage" type="number" value={formData.discountPercentage} onChange={handleInputChange} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Calculate</Label>
                      <div className="flex gap-2">
                        <Button type="button" variant={formData.discountCalculate === 'Fix' ? "default" : "outline"} onClick={() => setFormData(prev => prev ? {...prev, discountCalculate: 'Fix'} : null)}>Fix</Button>
                        <Button type="button" variant={formData.discountCalculate === 'Add Discount(%)' ? "default" : "outline"} onClick={() => setFormData(prev => prev ? {...prev, discountCalculate: 'Add Discount(%)'} : null)}>Add Discount(%)</Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label>Description(500 ch.)</Label>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description (500 ch.)" maxLength={500} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Attachment</Label>
              <Input type="file" name="attachment" onChange={handleFileChange} />
            </div>

            <div className="md:col-span-2 flex justify-start gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>View</Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>Close</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
