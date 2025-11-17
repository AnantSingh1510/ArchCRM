"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Edit, Trash2, Mail, Shield, CheckCircle, XCircle } from "lucide-react";
import { User, UserRole } from "@/lib/auth-context";
import withRole from "@/components/withRole";

function BrokersPage() {
  const [brokers, setBrokers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await axios.get("http://localhost:3000/broker", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setBrokers(res.data);
        } else {
          setError("Failed to fetch brokers");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    };

    fetchBrokers();
  }, []);

  const filteredBrokers = brokers.filter(
    (b) =>
      (b.name && b.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Broker Management
          </h1>
          <p className="text-muted-foreground">Manage broker accounts</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Broker
        </Button>
      </div>

      <Card className="p-4 border border-border">
        <div className="flex gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search brokers by name or email..."
            className="border-0 bg-transparent"
          />
        </div>
      </Card>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrokers.map((broker) => (
                <tr key={broker.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{broker.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {broker.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{broker.phone}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(broker.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withRole("brokers", "read")(BrokersPage);
