"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, User, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

export default function ApprovalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [approval, setApproval] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchApproval = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`http://localhost:3000/approval/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApproval(response.data);

        if (response.data.type === 'INVOICE') {
          const clientRes = await axios.get(`http://localhost:3000/client/${response.data.data.clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClient(clientRes.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch approval:', error);
        setLoading(false);
      }
    };

    fetchApproval();
  }, [id]);

  const handleApproval = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.patch(`http://localhost:3000/approval/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/dashboard/admin/approvals');
    } catch (error) {
      console.error('Failed to update approval:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!approval) {
    return <p>Approval not found.</p>;
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/approvals">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <h1 className="text-3xl font-bold">Approval Request</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {approval.type}
            <span className="text-xs font-normal text-gray-500">by {approval.requester.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approval.type === 'INVOICE' && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <Link href={`/dashboard/clients/${approval.data.clientId}`} className="text-blue-600 hover:underline">
                  {client?.name || approval.data.clientId}
                </Link>
              </div>
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /><span>Amount: {approval.data.amount}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Due Date: {new Date(approval.data.dueDate).toLocaleDateString()}</span></div>
              <p className="pt-2">{approval.data.description}</p>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1"><Check className="w-4 h-4 mr-2" />Approve</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>This will approve the request and cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleApproval('APPROVED')}>Approve</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" variant="destructive"><X className="w-4 h-4 mr-2" />Reject</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>This will reject the request and cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleApproval('REJECTED')}>Reject</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
