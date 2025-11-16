"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewBookingPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    // Unit Information
    unitHolderType: 'INDIVIDUAL',
    projectId: '',
    unitType: 'RESIDENTIAL',
    customerClassification: 'DIRECT',
    brokerId: '',
    mainBrokerId: '',
    bookingType: 'NORMAL',
    tower: '',
    floor: '',
    unitNo: '',
    paymentPlan: '',
    applicationDate: new Date().toISOString().split('T')[0],
    basicPrice: '',
    formNo: '',
    registrationNo: '',
    gstin: '',

    // Discounts
    inauguralDiscount: '',
    companyRebate: '',
    companyPerSqFt: '',
    companyPercentage: '',
    brokerRebate: '',
    brokerPerSqFt: '',
    brokerPercentage: '',

    // First Applicant
    applicantTitle: 'Mr.',
    applicantFirstName: '',
    applicantMiddleName: '',
    applicantLastName: '',
    applicantRelationName: '',
    applicantDob: '',
    applicantAnniversary: '',
    applicantNationality: 'RESIDENT',
    applicantMaritalStatus: 'UNMARRIED',
    applicantGender: 'MALE',
    applicantChildren: '',
    applicantPassportNo: '',
    applicantPanNo: '',
    applicantEmail1: '',
    applicantEmail2: '',
    applicantProfession: '',
    applicantDesignation: '',
    applicantCompany: '',
    applicantAadhaarNo: '',
    applicantAccountName: '',
    applicantAccountNo: '',
    applicantIfsc: '',
    applicantBank: '',
    applicantBranch: '',
    
    // Addresses
    presentAddress: '', presentPinCode: '', presentCountry: 'India', presentState: '', presentCity: '',
    presentMobile1: '', presentMobile2: '', presentPhone: '', presentStd: '',
    officeAddress: '', officePinCode: '', officeCountry: 'India', officeState: '', officeCity: '',
    officeMobile1: '', officeMobile2: '', officePhone: '', officeStd: '',
    permanentAddress: '', permanentPinCode: '', permanentCountry: 'India', permanentState: '', permanentCity: '',
    permanentMobile1: '', permanentMobile2: '', permanentPhone: '', permanentStd: '',
    fillOfficeAddress: false,
    fillPermanentAddress: false,
    mailingAddress: 'PRESENT',
    communicationPreference: 'EMAIL',

    // Sales Employee
    salesEmployeeId: '',
    remarks: '',

    // Other Costs & Finance
    addNominee: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      try {
        const [projectsRes, usersRes, propertiesRes] = await Promise.all([
          axios.get('http://localhost:3000/project', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/user', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/property', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProjects(projectsRes.data);
        setUsers(usersRes.data);
        setProperties(propertiesRes.data);
      } catch (error) {
        console.error('Failed to fetch data for form:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      await axios.post('http://localhost:3000/booking', { 
        ...formData,
        basicPrice: parseFloat(formData.basicPrice) || 0,
        applicationDate: new Date(formData.applicationDate),
       });
      alert('Booking Submitted! See console for data.');
      router.push('/dashboard/admin/bookings');
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking. Check console for details.');
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">New Unit Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Unit Information */}
        <Card>
          <CardHeader><CardTitle>Unit Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2"><Label>Unit Information</Label><RadioGroup defaultValue="INDIVIDUAL" onValueChange={(v) => handleSelectChange('unitHolderType', v)}><div className="flex items-center space-x-2"><RadioGroupItem value="INDIVIDUAL" id="ind" /><Label htmlFor="ind">Individual</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="MULTIPLE" id="mul" /><Label htmlFor="mul">Multiple</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="COMPANY" id="com" /><Label htmlFor="com">Company</Label></div></RadioGroup></div>
            <div className="space-y-2"><Label>Project*</Label><Select name="projectId" onValueChange={(v) => handleSelectChange('projectId', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{projects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Unit Type*</Label><Select name="unitType" onValueChange={(v) => handleSelectChange('unitType', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent><SelectItem value="RESIDENTIAL">Residential</SelectItem><SelectItem value="COMMERCIAL">Commercial</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Customer Classification</Label><RadioGroup defaultValue="DIRECT" onValueChange={(v) => handleSelectChange('customerClassification', v)}><div className="flex items-center space-x-2"><RadioGroupItem value="BROKER" id="broker" /><Label htmlFor="broker">Broker</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="DIRECT" id="direct" /><Label htmlFor="direct">Direct</Label></div></RadioGroup></div>
            <div className="space-y-2"><Label>Broker*</Label><Select name="brokerId" onValueChange={(v) => handleSelectChange('brokerId', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{users.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Main Broker</Label><Select name="mainBrokerId" onValueChange={(v) => handleSelectChange('mainBrokerId', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{users.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2 col-span-2"><Label>Booking Type</Label><RadioGroup defaultValue="NORMAL" onValueChange={(v) => handleSelectChange('bookingType', v)} className="flex space-x-4"><div className="flex items-center space-x-2"><RadioGroupItem value="NORMAL" id="normal" /><Label htmlFor="normal">Normal Booking</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="HOLD" id="hold" /><Label htmlFor="hold">Hold Unit</Label></div></RadioGroup></div>
            <div className="space-y-2"><Label>Tower</Label><Select name="tower" onValueChange={(v) => handleSelectChange('tower', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{[...new Set(properties.map((p: any) => p.tower))].map((tower: any) => <SelectItem key={tower} value={tower}>{tower}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Floor</Label><Select name="floor" onValueChange={(v) => handleSelectChange('floor', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{[...new Set(properties.map((p: any) => p.floor))].map((floor: any) => <SelectItem key={floor} value={floor}>{floor}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Unit No.</Label><Select name="unitNo" onValueChange={(v) => handleSelectChange('unitNo', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{properties.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.unitNumber}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Payment Plan*</Label><Select name="paymentPlan" onValueChange={(v) => handleSelectChange('paymentPlan', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div>
            <div className="space-y-2"><Label>Application Date*</Label><Input type="date" name="applicationDate" value={formData.applicationDate} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Basic Price*</Label><Input name="basicPrice" value={formData.basicPrice} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Form No.</Label><Input name="formNo" value={formData.formNo} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Registration No.*</Label><Input name="registrationNo" value={formData.registrationNo} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>GSTIN</Label><Input name="gstin" value={formData.gstin} onChange={handleChange} /></div>
          </CardContent>
        </Card>

        {/* Discounts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Company Discount</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Inaugural Discount</Label><Input name="inauguralDiscount" value={formData.inauguralDiscount} onChange={handleChange} /></div>
              <div></div>
              <div className="space-y-2"><Label>Rebate (Rs.)</Label><Input name="companyRebate" value={formData.companyRebate} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Per SqFeet (Rs.)</Label><Input name="companyPerSqFt" value={formData.companyPerSqFt} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>In (%)</Label><Input name="companyPercentage" value={formData.companyPercentage} onChange={handleChange} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Broker Discount</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Rebate (Rs.)</Label><Input name="brokerRebate" value={formData.brokerRebate} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Per SqFeet (Rs.)</Label><Input name="brokerPerSqFt" value={formData.brokerPerSqFt} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>In (%)</Label><Input name="brokerPercentage" value={formData.brokerPercentage} onChange={handleChange} /></div>
            </CardContent>
          </Card>
        </div>

        {/* First Applicant */}
        <Card>
          <CardHeader><CardTitle>First Applicant</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 col-span-full"><Label>Name*</Label><div className="flex gap-2"><Select defaultValue="Mr." onValueChange={(v) => handleSelectChange('applicantTitle', v)}><SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Mr.">Mr.</SelectItem><SelectItem value="Mrs.">Mrs.</SelectItem><SelectItem value="Ms.">Ms.</SelectItem></SelectContent></Select><Input name="applicantFirstName" placeholder="First Name" onChange={handleChange} /><Input name="applicantMiddleName" placeholder="Middle Name" onChange={handleChange} /><Input name="applicantLastName" placeholder="Last Name" onChange={handleChange} /></div></div>
            <div className="space-y-2"><Label>S/o</Label><Input name="applicantRelationName" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Date Of Birth</Label><Input type="date" name="applicantDob" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Anniversary Date</Label><Input type="date" name="applicantAnniversary" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Nationality</Label><RadioGroup defaultValue="RESIDENT" onValueChange={(v) => handleSelectChange('applicantNationality', v)} className="flex space-x-2"><RadioGroupItem value="RESIDENT" id="res" /><Label htmlFor="res">Resident</Label><RadioGroupItem value="PIO" id="pio" /><Label htmlFor="pio">PIO</Label><RadioGroupItem value="NRI" id="nri" /><Label htmlFor="nri">NRI</Label><RadioGroupItem value="OCI" id="oci" /><Label htmlFor="oci">OCI</Label></RadioGroup></div>
            <div className="space-y-2"><Label>Marital Status</Label><Select onValueChange={(v) => handleSelectChange('applicantMaritalStatus', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent><SelectItem value="MARRIED">Married</SelectItem><SelectItem value="UNMARRIED">Unmarried</SelectItem><SelectItem value="NOT_SPECIFIED">Not Specified</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Gender*</Label><RadioGroup defaultValue="MALE" onValueChange={(v) => handleSelectChange('applicantGender', v)} className="flex space-x-2"><RadioGroupItem value="MALE" id="male" /><Label htmlFor="male">Male</Label><RadioGroupItem value="FEMALE" id="female" /><Label htmlFor="female">Female</Label><RadioGroupItem value="TRANSGENDER" id="trans" /><Label htmlFor="trans">Transgender</Label></RadioGroup></div>
            <div className="space-y-2"><Label>No. of Children</Label><Input type="number" name="applicantChildren" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Passport No.</Label><Input name="applicantPassportNo" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>PAN No.</Label><Input name="applicantPanNo" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>E-mail Id-1</Label><Input type="email" name="applicantEmail1" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>E-mail Id-2</Label><Input type="email" name="applicantEmail2" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Profession</Label><Select><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div>
            <div className="space-y-2"><Label>Designation</Label><Input name="applicantDesignation" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Company/Firm</Label><Input name="applicantCompany" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Aadhaar No.</Label><Input name="applicantAadhaarNo" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Account Name</Label><Input name="applicantAccountName" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Account No.</Label><Input name="applicantAccountNo" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>IFSC Code</Label><Input name="applicantIfsc" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Bank</Label><Select><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div>
            <div className="space-y-2"><Label>Branch</Label><Input name="applicantBranch" onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Attach Photo</Label><Input type="file" /></div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader><CardTitle>First Applicant Address</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div><CardDescription>Present Address</CardDescription><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2"><div className="space-y-2 col-span-2"><Label>Address*</Label><Input name="presentAddress" onChange={handleChange} /></div><div className="space-y-2"><Label>Pin Code</Label><Input name="presentPinCode" onChange={handleChange} /></div><div className="space-y-2"><Label>Country</Label><Input name="presentCountry" value="India" disabled /></div><div className="space-y-2"><Label>State</Label><Select><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div><div className="space-y-2"><Label>City</Label><Select><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div><div className="space-y-2"><Label>1st Mobile No.</Label><Input name="presentMobile1" onChange={handleChange} /></div><div className="space-y-2"><Label>2nd Mobile No.</Label><Input name="presentMobile2" onChange={handleChange} /></div></div></div>
            <div><div className="flex items-center space-x-2"><Checkbox id="fillOfficeAddress" name="fillOfficeAddress" onCheckedChange={(c) => handleSelectChange('fillOfficeAddress', c.toString())} /><label htmlFor="fillOfficeAddress">Office Address</label></div>{formData.fillOfficeAddress && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2"><div className="space-y-2 col-span-2"><Label>Address</Label><Input name="officeAddress" onChange={handleChange} /></div><div className="space-y-2"><Label>Pin Code</Label><Input name="officePinCode" onChange={handleChange} /></div><div className="space-y-2"><Label>Country</Label><Input name="officeCountry" value="India" disabled /></div><div className="space-y-2"><Label>State</Label><Select><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div><div className="space-y-2"><Label>City</Label><Select><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div><div className="space-y-2"><Label>1st Mobile No.</Label><Input name="officeMobile1" onChange={handleChange} /></div><div className="space-y-2"><Label>2nd Mobile No.</Label><Input name="officeMobile2" onChange={handleChange} /></div></div>}</div>
            <div><div className="flex items-center space-x-2"><Checkbox id="fillPermanentAddress" name="fillPermanentAddress" onCheckedChange={(c) => handleSelectChange('fillPermanentAddress', c.toString())} /><label htmlFor="fillPermanentAddress">Permanent Address</label></div>{formData.fillPermanentAddress && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2"><div className="space-y-2 col-span-2"><Label>Address</Label><Input name="permanentAddress" onChange={handleChange} /></div><div className="space-y-2"><Label>Pin Code</Label><Input name="permanentPinCode" onChange={handleChange} /></div><div className="space-y-2"><Label>Country</Label><Input name="permanentCountry" value="India" disabled /></div><div className="space-y-2"><Label>State</Label><Select><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div><div className="space-y-2"><Label>City</Label><Select><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent></SelectContent></Select></div><div className="space-y-2"><Label>1st Mobile No.</Label><Input name="permanentMobile1" onChange={handleChange} /></div><div className="space-y-2"><Label>2nd Mobile No.</Label><Input name="permanentMobile2" onChange={handleChange} /></div></div>}</div>
            <div className="space-y-2"><Label>Mailing Address</Label><RadioGroup defaultValue="PRESENT" onValueChange={(v) => handleSelectChange('mailingAddress', v)} className="flex space-x-4"><RadioGroupItem value="PRESENT" id="p" /><Label htmlFor="p">Present</Label><RadioGroupItem value="OFFICE" id="o" /><Label htmlFor="o">Office</Label><RadioGroupItem value="PERMANENT" id="perm" /><Label htmlFor="perm">Permanent</Label></RadioGroup></div>
            <div className="space-y-2"><Label>Preferable mode of communication</Label><RadioGroup defaultValue="EMAIL" onValueChange={(v) => handleSelectChange('communicationPreference', v)} className="flex flex-wrap gap-4"><RadioGroupItem value="COURIER" id="c" /><Label htmlFor="c">Courier</Label><RadioGroupItem value="EMAIL" id="e" /><Label htmlFor="e">Email</Label><RadioGroupItem value="SMS" id="s" /><Label htmlFor="s">SMS</Label><RadioGroupItem value="NONE" id="n" /><Label htmlFor="n">No Communication</Label><RadioGroupItem value="BY_HAND" id="bh" /><Label htmlFor="bh">By Hand</Label></RadioGroup></div>
          </CardContent>
        </Card>

        {/* Sales Employee & Other */}
        <Card>
          <CardHeader><CardTitle>Sales & Other Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Sales Employee</Label><Select name="salesEmployeeId" onValueChange={(v) => handleSelectChange('salesEmployeeId', v)}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{users.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Remarks</Label><Input name="remarks" onChange={handleChange} /></div>
            <div className="col-span-full"><CardDescription>Other Costs</CardDescription><div className="text-sm text-gray-600 mt-2"> (1.) PLC (2.) Other Charge (3.) Alteration/ Scheme (4.) IFMS/Fire Fighting (5.) Extra Addon Charges (6.) Extra Charge</div></div>
            <div className="col-span-full"><div className="flex items-center space-x-2"><Checkbox id="addNominee" name="addNominee" onCheckedChange={(c) => handleSelectChange('addNominee', c.toString())} /><label htmlFor="addNominee">Would you like to add nominee details?</label></div></div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">Create Booking</Button>
        </div>
      </form>
    </div>
  );
}
