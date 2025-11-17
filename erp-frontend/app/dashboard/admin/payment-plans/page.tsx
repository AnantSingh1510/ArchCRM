"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useAuthContext } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function PaymentPlansPage() {
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [projects, setProjects] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { token } = useAuthContext();
  const router = useRouter();

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
  }, [token]);

  const handleView = (id: string) => {
    router.push(`/dashboard/admin/payment-plans/${id}`);
  };

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
        <div className="bg-white rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead>Timely Discount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentPlans.map((plan: any) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.planName}</TableCell>
                  <TableCell>{projects[plan.projectId]?.name}</TableCell>
                  <TableCell>{plan.planType}</TableCell>
                  <TableCell>{plan.timelyDiscount ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(plan.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Link href={`/dashboard/admin/payment-plans/${plan.id}/edit`}>
                        <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => {
                        // Handle delete
                      }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
