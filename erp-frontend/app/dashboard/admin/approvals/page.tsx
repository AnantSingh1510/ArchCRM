"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:3000/approval', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovals(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch approvals:', error);
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const handleApproval = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.patch(`http://localhost:3000/approval/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovals(approvals.filter((a: any) => a.id !== id));
    } catch (error) {
      console.error('Failed to update approval:', error);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Approvals</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvals.map((approval: any) => (
            <Card key={approval.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {approval.type}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleApproval(approval.id, 'APPROVED')}><Check className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleApproval(approval.id, 'REJECTED')}><X className="w-4 h-4" /></Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(approval.data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
