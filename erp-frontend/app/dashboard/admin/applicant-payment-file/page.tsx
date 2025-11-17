"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Index = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    project: '',
    groupName: '',
    unitType: '',
    plan: '',
    broker: '',
    tower: '',
    floor: '',
    customerClassification: '',
    employee: '',
    type: '',
    location: '',
    registry: '',
    registrationNo: '',
    name: '',
    unitNo: '',
    formNo: '',
    bookingDate: '',
    dealAsOnDate: '',
    filterType: 'totalSaleValue',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await axios.get("http://localhost:3000/reports/applicant-payment-file", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("An unexpected error occurred. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const scrollTable = (direction: 'left' | 'right') => {
    const scrollContainer = document.getElementById('table-scroll-container');
    if (scrollContainer) {
      const scrollAmount = 300;
      scrollContainer.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Applicant Payment File</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Select onValueChange={(v) => handleFilterChange('project', v)}>
              <SelectTrigger><SelectValue placeholder="Project" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('groupName', v)}>
              <SelectTrigger><SelectValue placeholder="Group Name" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('unitType', v)}>
              <SelectTrigger><SelectValue placeholder="Unit Type" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('plan', v)}>
              <SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('broker', v)}>
              <SelectTrigger><SelectValue placeholder="Broker" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('tower', v)}>
              <SelectTrigger><SelectValue placeholder="Tower" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('floor', v)}>
              <SelectTrigger><SelectValue placeholder="Floor" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('customerClassification', v)}>
              <SelectTrigger><SelectValue placeholder="Customer Classification" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('employee', v)}>
              <SelectTrigger><SelectValue placeholder="Employee" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('type', v)}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('location', v)}>
              <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Select onValueChange={(v) => handleFilterChange('registry', v)}>
              <SelectTrigger><SelectValue placeholder="Registry" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
            <Input placeholder="Registration No." onChange={(e) => handleFilterChange('registrationNo', e.target.value)} />
            <Input placeholder="Name" onChange={(e) => handleFilterChange('name', e.target.value)} />
            <Input placeholder="Unit No." onChange={(e) => handleFilterChange('unitNo', e.target.value)} />
            <Input placeholder="Form No." onChange={(e) => handleFilterChange('formNo', e.target.value)} />
            <Input type="date" placeholder="Booking Date" onChange={(e) => handleFilterChange('bookingDate', e.target.value)} />
            <Select onValueChange={(v) => handleFilterChange('filterType', v)}>
              <SelectTrigger><SelectValue placeholder="Filter Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSaleValue">Total Sale Value</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" placeholder="Deal As On Date" onChange={(e) => handleFilterChange('dealAsOnDate', e.target.value)} />
            <Button className="md:col-span-2 lg:col-span-1">Fetch</Button>
          </CardContent>
        </Card>

        <Card className="w-full max-w-[85vw] px-4 mx-auto">

          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payment Records</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollTable('left')}
                aria-label="Scroll left"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollTable('right')}
                aria-label="Scroll right"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              id="table-scroll-container"
              className="relative w-full max-w-full overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-muted scrollbar-track-background"
              style={{ maxHeight: 'calc(100vh - 450px)' }}
            >

              <Table className="relative min-w-max">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead 
                      className="sticky left-0 z-20 bg-muted/50 min-w-[60px]
                      after:absolute after:top-0 after:bottom-0 after:right-0 
                      after:w-[6px] after:bg-gradient-to-r after:from-black/10 after:to-transparent"
                    >
                      S.No.
                    </TableHead>

                    <TableHead className="whitespace-nowrap min-w-[120px]">Booking No.</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px]">Mobile No.</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[200px]">Email</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px]">Agreement Date</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px]">Unit Type</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[80px]">Tower</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[80px]">Floor</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px]">Unit No</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px]">Plan</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px]">Broker</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px]">Main Broker</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px]">Employee</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[80px]">Loan</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px]">Bank</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[80px]">Rank</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Signed Area</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Carpet Area</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Built-up Area</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px] text-right">Rate</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[140px] text-right">After Disc. Rate</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Net Price</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px] text-right">Discount</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Other Cost</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Global Cost</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px] text-right">Cost SGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px] text-right">Cost CGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right font-semibold">Total Cost</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Dues Cost</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px] text-right">Dues SGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[100px] text-right">Dues CGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right font-semibold">Total Dues</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[130px] text-right">Received Amount</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px] text-right">Received SGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px] text-right">Received CGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[130px] text-right font-semibold">Total Received</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[60px] text-right">%</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px] text-right">Credit Amount</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Credit SGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[110px] text-right">Credit CGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px] text-right font-semibold">Total Credit</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[150px] text-right">Outstanding Amount</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[140px] text-right">Outstanding SGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[140px] text-right">Outstanding CGST</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[150px] text-right font-semibold">Total Outstanding</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[150px] text-right font-semibold">Balance Receivable</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[140px] text-right">Interest Received</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[150px] text-right">Interest Outstanding</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[130px] text-right">Interest Waived</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={48} className="text-center py-8 text-muted-foreground">
                        No data available. Click "Fetch" to load payment records.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item: any, index) => (
                      <TableRow key={item.id || index} className="hover:bg-muted/30 transition-colors">
                        <TableCell
                          className="sticky left-0 z-10 bg-background font-medium
                          after:absolute after:top-0 after:bottom-0 after:right-0 
                          after:w-[6px] after:bg-gradient-to-r after:from-black/10 after:to-transparent"
                        >
                          {index + 1}
                        </TableCell>

                        <TableCell className="whitespace-nowrap">{item.bookingNo || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.mobileNo || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.email || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.agreementDate ? new Date(item.agreementDate).toLocaleDateString() : '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.unitType || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.tower || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.floor || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.unitNo || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.plan || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.broker || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.mainBroker || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.employee || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.loan || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.bank || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.rank || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.signedArea || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.carpetArea || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.builtUpArea || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.rate || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.afterDiscountRate || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.netPrice || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.discount || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.otherCost || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.globalCost || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.costSgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.costCgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right font-semibold">{item.totalCost || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.duesCost || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.duesSgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.duesCgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right font-semibold">{item.totalDues || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.receivedAmount || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.receivedSgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.receivedCgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right font-semibold">{item.totalReceived || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.receivedPercentage ? `${item.receivedPercentage}%` : '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.creditAmount || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.creditSgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.creditCgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right font-semibold">{item.totalCredit || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.outstandingAmount || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.outstandingSgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.outstandingCgst || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right font-semibold">{item.totalOutstanding || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right font-semibold">{item.balanceReceivable || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.interestReceived || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.interestOutstanding || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{item.interestWaived || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
