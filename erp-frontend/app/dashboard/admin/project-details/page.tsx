"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Breadcrumb from "@/components/Breadcrumb"
import { Download, Printer } from "lucide-react"

const statusColors = {
  Mortgage: "bg-blue-500",
  "Director Hold": "bg-green-500",
  Hold: "bg-yellow-500",
  Unapproved: "bg-red-500",
  Booked: "bg-purple-500",
  Alloted: "bg-indigo-500",
  "Rera Registered": "bg-pink-500",
  Registry: "bg-teal-500",
  "Temp.Surrender": "bg-orange-500",
}

export default function ProjectDetailsPage() {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    project: '',
    tower: '',
    floor: '',
    unitNo: '',
    name: '',
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get("http://localhost:3000/reports/unit-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.");
    }
  };

  const fetchFilterData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const [projectsRes] = await Promise.all([
        axios.get("http://localhost:3000/project", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error("Failed to fetch filter data.", error);
    }
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Inventory", href: "/dashboard/admin/inventory" },
          { label: "Unit Status Report" },
        ]}
      />
      <h1 className="text-3xl font-bold my-6 text-foreground">Unit Status</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project*</label>
              <Select value={filters.project} onValueChange={(v) => handleFilterChange('project', v)}>
                <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Select><SelectTrigger><SelectValue placeholder="<--All-->" /></SelectTrigger><SelectContent /></Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit Type</label>
              <Select><SelectTrigger><SelectValue placeholder="<--Select-->" /></SelectTrigger><SelectContent /></Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tower</label>
              <Select><SelectTrigger><SelectValue placeholder="<--Select-->" /></SelectTrigger><SelectContent /></Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Floor</label>
              <Select><SelectTrigger><SelectValue placeholder="<--All-->" /></SelectTrigger><SelectContent /></Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Name" value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit No.</label>
              <Input placeholder="Unit No." value={filters.unitNo} onChange={(e) => handleFilterChange('unitNo', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select><SelectTrigger><SelectValue placeholder="<--All-->" /></SelectTrigger><SelectContent /></Select>
            </div>
            <Button className="w-full" onClick={fetchData}>Fetch</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {Object.keys(statusColors).map(status => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox id={status.toLowerCase().replace(' ', '-')}/>
                <label htmlFor={status.toLowerCase().replace(' ', '-')} className="text-sm font-medium">{status}</label>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
            <div><span className="font-semibold">Total Unit :</span> 48</div>
            <div><span className="font-semibold">Available Unit :</span> 2</div>
            <div><span className="font-semibold">Mortgage Unit :</span> 0</div>
            <div><span className="font-semibold">Hold Unit :</span> 1</div>
            <div><span className="font-semibold">Unapproved Unit :</span> 0</div>
            <div><span className="font-semibold">Booked Unit :</span> 0</div>
            <div><span className="font-semibold">Alloted Unit :</span> 2</div>
            <div><span className="font-semibold">Rera Registered :</span> 0</div>
            <div><span className="font-semibold">Registry Unit :</span> 42</div>
            <div><span className="font-semibold">Temp.Surrender Unit :</span> 1</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-4 h-4 ${color}`}></div>
                <span className="text-sm">{status}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No.</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Tower</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Unit Type</TableHead>
                  <TableHead>Area (Sq.Ft.)</TableHead>
                  <TableHead>Super Area (Sq.Ft.)</TableHead>
                  <TableHead>Carpet Area (Sq.Ft.)</TableHead>
                  <TableHead>Plot Area (Sq.Yd.)</TableHead>
                  <TableHead>Unit No.</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Broker</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row: any) => (
                  <TableRow key={row.s_no}>
                    <TableCell>{row.s_no}</TableCell>
                    <TableCell>{row.registration_no}</TableCell>
                    <TableCell>
                      {row.client_id ? (
                        <Link href={`/dashboard/clients/${row.client_id}`} className="text-blue-600 hover:underline">
                          {row.name}
                        </Link>
                      ) : (
                        row.name
                      )}
                    </TableCell>
                    <TableCell>{row.tower}</TableCell>
                    <TableCell>{row.floor}</TableCell>
                    <TableCell>{row.group}</TableCell>
                    <TableCell>{row.unit_type}</TableCell>
                    <TableCell>{row.area}</TableCell>
                    <TableCell>{row.super_area}</TableCell>
                    <TableCell>{row.carpet_area}</TableCell>
                    <TableCell>{row.plot_area}</TableCell>
                    <TableCell>{row.unit_no}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.broker}</TableCell>
                    <TableCell>
                      <div>{row.status}</div>
                      <div className="text-xs text-muted-foreground">({row.status_date})</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
