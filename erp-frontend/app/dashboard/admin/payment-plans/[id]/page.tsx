"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthContext } from '@/context/auth-context';
import { Edit } from 'lucide-react';

export default function PaymentPlanDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthContext();

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      try {
        const planRes = await axios.get(`http://localhost:3000/payment-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlan(planRes.data);

        if (planRes.data.projectId) {
          const projectRes = await axios.get(`http://localhost:3000/project/${planRes.data.projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProject(projectRes.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch payment plan:', error);
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;
  if (!plan) return <p>Payment plan not found.</p>;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payment Plan Details</h1>
        <Button onClick={() => router.push(`/dashboard/admin/payment-plans/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Plan
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{plan.planName}</CardTitle>
          <p className="text-sm text-gray-500">{project?.name}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <p><strong>Plan Type:</strong></p>
              <p>{plan.planType}</p>
            </div>
            {plan.roi && (
              <div className="space-y-2">
                <p><strong>ROI:</strong></p>
                <p>{plan.roi}%</p>
              </div>
            )}
            {plan.emiCycle && (
              <div className="space-y-2">
                <p><strong>EMI Cycle:</strong></p>
                <p>{plan.emiCycle}</p>
              </div>
            )}
            <div className="space-y-2">
              <p><strong>Payment Type:</strong></p>
              <p>{plan.type}</p>
            </div>
            <div className="space-y-2">
              <p><strong>Timely Discount:</strong></p>
              <p>{plan.timelyDiscount ? 'Yes' : 'No'}</p>
            </div>
            {plan.discountPerArea && (
              <div className="space-y-2">
                <p><strong>Discount (Per Area):</strong></p>
                <p>{plan.discountPerArea}</p>
              </div>
            )}
            {plan.discountPercentage && (
              <div className="space-y-2">
                <p><strong>Discount (%):</strong></p>
                <p>{plan.discountPercentage}</p>
              </div>
            )}
            {plan.discountCalculate && (
              <div className="space-y-2">
                <p><strong>Discount Calculation:</strong></p>
                <p>{plan.discountCalculate}</p>
              </div>
            )}
            {plan.description && (
              <div className="md:col-span-3 space-y-2">
                <p><strong>Description:</strong></p>
                <p>{plan.description}</p>
              </div>
            )}
            {plan.attachmentUrl && (
              <div className="md:col-span-3 space-y-2">
                <p><strong>Attachment:</strong></p>
                <a href={`http://localhost:3000${plan.attachmentUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Attachment
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
