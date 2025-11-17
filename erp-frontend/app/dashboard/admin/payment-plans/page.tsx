"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAuthContext } from '@/context/auth-context';

export default function PaymentPlansPage() {
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [projects, setProjects] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, projectsRes] = await Promise.all([
          axios.get('http://localhost:3000/payment-plans', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/project', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const projectMap = projectsRes.data.reduce((acc: any, project: any) => {
          acc[project.id] = project;
          return acc;
        }, {});

        setPaymentPlans(plansRes.data);
        setProjects(projectMap);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payment Plans</h1>
        <Link href="/dashboard/admin/payment-plans/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Payment Plan
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentPlans.map((plan: any) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {plan.name}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/admin/payment-plans/${plan.id}/edit`}>
                      <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => {
                      // Handle delete
                    }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardTitle>
                <p className="text-sm text-gray-500">{projects[plan.projectId]?.name}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Down Payment:</strong> {plan.details.downPayment}%</p>
                  <p><strong>Installments:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    {plan.details.installments.map((inst: any, index: number) => (
                      <li key={index}>
                        <span className="font-semibold">₹{inst.amount.toLocaleString()}</span> due on <span className="font-semibold">{new Date(inst.dueDate).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
