"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, User, Calendar, DollarSign, Clock, CheckCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [clients, setClients] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const [approvalsRes, clientsRes] = await Promise.all([
          axios.get('http://localhost:3000/approval', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/client', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const clientMap = clientsRes.data.reduce((acc: any, client: any) => {
          acc[client.id] = client;
          return acc;
        }, {});

        setApprovals(approvalsRes.data);
        setClients(clientMap);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredApprovals = approvals.filter((approval: any) => {
    const clientName = clients[approval.data.clientId]?.name || '';
    const amount = approval.data.amount?.toString() || '';
    const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
    const toDate = dateFilter.to ? new Date(dateFilter.to) : null;
    const approvalDate = new Date(approval.createdAt);

    return (
      (clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        amount.includes(searchTerm)) &&
      (!fromDate || approvalDate >= fromDate) &&
      (!toDate || approvalDate <= toDate)
    );
  });

  const pendingApprovals = filteredApprovals.filter((a: any) => a.status === 'PENDING');
  const completedApprovals = filteredApprovals.filter((a: any) => a.status !== 'PENDING');

  const renderInvoiceDetails = (data: any) => (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-500" />
        <Link href={`/dashboard/clients/${data.clientId}`} className="text-blue-600 hover:underline">
          {clients[data.clientId]?.name || data.clientId}
        </Link>
      </div>
      <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-500" /><span>Amount: {data.amount}</span></div>
      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /><span>Due Date: {new Date(data.dueDate).toLocaleDateString()}</span></div>
      <p className="pt-2 text-gray-600">{data.description}</p>
    </div>
  );

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Approvals</h1>

      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by client or amount..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateFilter.from}
              onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
            />
            <span className="text-gray-500">to</span>
            <Input
              type="date"
              value={dateFilter.to}
              onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {pendingApprovals.map((approval: any) => (
                <Link href={`/dashboard/admin/approvals/${approval.id}`} key={approval.id}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="font-bold">{approval.type}</span>
                        <span className="text-xs font-normal text-gray-500">by {approval.requester.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {approval.type === 'INVOICE' && renderInvoiceDetails(approval.data)}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {completedApprovals.map((approval: any) => (
              <Card key={approval.id} className={approval.status === 'REJECTED' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="font-bold">{approval.type}</span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${approval.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                      {approval.status === 'APPROVED' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {approval.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {approval.type === 'INVOICE' && renderInvoiceDetails(approval.data)}
                  <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Processed on {new Date(approval.updatedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
