"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function PaymentPlansPage() {
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:3000/payment-plan', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaymentPlans(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch payment plans:', error);
        setLoading(false);
      }
    };

    fetchPaymentPlans();
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
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(plan.details, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
