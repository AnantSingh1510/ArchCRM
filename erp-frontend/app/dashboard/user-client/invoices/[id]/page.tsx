"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { useParams } from "next/navigation"
import BackButton from "../../../../../components/BackButton"
import { Badge } from "../../../../../components/ui/badge"
import { Button } from "../../../../../components/ui/button"
import jsPDF from "jspdf"
import autoTable from 'jspdf-autotable'

export default function InvoiceDetailPage() {
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { id } = useParams();

  const generatePdf = useCallback((invoiceData: any) => {
    if (!invoiceData) return null;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add decorative top border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(3);
    doc.line(15, 10, pageWidth - 15, 10);
    doc.setLineWidth(0.5);
    doc.line(15, 13, pageWidth - 15, 13);
    
    // Company/Header Section
    doc.setFontSize(24);
    doc.setFont('times', 'bold');
    doc.text('INVOICE', pageWidth / 2, 25, { align: 'center' });
    
    // Invoice number in decorative box
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.text(`No. ${invoiceData.id}`, pageWidth / 2, 32, { align: 'center' });
    
    // Decorative line under header
    doc.setLineWidth(0.5);
    doc.line(15, 38, pageWidth - 15, 38);
    
    // Date section (top right corner style)
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.text('Date:', pageWidth - 60, 48);
    doc.setFont('times', 'bold');
    doc.text(new Date(invoiceData.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), pageWidth - 45, 48);
    
    // "BILLED TO" section with underline
    doc.setFontSize(11);
    doc.setFont('times', 'bold');
    doc.text('BILLED TO:', 20, 58);
    doc.setLineWidth(0.3);
    doc.line(20, 60, 60, 60);
    
    // Client details
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text(invoiceData.client.name, 20, 68);
    
    // Invoice details table with classic styling
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    
    // Create items table
    autoTable(doc, {
      startY: 85,
      head: [['DESCRIPTION', 'AMOUNT']],
      body: [
        [invoiceData.description || 'Services Rendered', ''],
        ['', ''],
      ],
      foot: [
        ['Due Date:', new Date(invoiceData.dueDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })],
        ['', ''],
        ['TOTAL AMOUNT DUE:', `₹${invoiceData.amount.toLocaleString()}`],
      ],
      theme: 'plain',
      styles: {
        font: 'times',
        fontSize: 11,
        cellPadding: 5,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'left',
        lineWidth: { bottom: 0.5, top: 0.5 },
      },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: { top: 0.5, bottom: 0.5 },
      },
      columnStyles: {
        0: { 
          cellWidth: 120,
          fontStyle: 'normal',
        },
        1: { 
          cellWidth: 50,
          halign: 'right',
          fontStyle: 'bold',
        },
      },
      didParseCell: function(data) {
        // Add borders to all cells
        if (data.section === 'body') {
          data.cell.styles.lineWidth = 0.5
        }
        // Make total amount larger
        if (data.section === 'foot' && data.row.index === 2) {
          data.cell.styles.fontSize = 13
          data.cell.styles.fontStyle = 'bold'
        }
        // Style due date row
        if (data.section === 'foot' && data.row.index === 0) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'normal'
        }
      },
      didDrawPage: function(data) {
        // Add side borders to table
        const tableTop = data.settings.startY
        const tableBottom = (data as any).cursor.y
        doc.setLineWidth(0.5)
        doc.line(15, tableTop, 15, tableBottom)
        doc.line(pageWidth - 15, tableTop, pageWidth - 15, tableBottom)
      }
    })
    
    // Payment status stamp
    const finalY = (doc as any).lastAutoTable.finalY + 20
    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    
    if (invoiceData.status === 'PAID') {
      // Paid stamp
      doc.setDrawColor(16, 185, 129)
      doc.setTextColor(16, 185, 129)
      doc.setLineWidth(2)
      doc.roundedRect(pageWidth - 65, finalY, 45, 15, 2, 2)
      doc.text('PAID', pageWidth - 42.5, finalY + 10, { align: 'center' })
    } else {
      // Pending stamp
      doc.setDrawColor(251, 191, 36)
      doc.setTextColor(251, 191, 36)
      doc.setLineWidth(2)
      doc.roundedRect(pageWidth - 70, finalY, 50, 15, 2, 2)
      doc.text('PENDING', pageWidth - 45, finalY + 10, { align: 'center' })
    }
    
    // Reset color
    doc.setTextColor(0, 0, 0)
    
    // Terms and conditions section
    doc.setFontSize(9)
    doc.setFont('times', 'italic')
    const termsY = finalY + 30
    doc.text('Terms & Conditions:', 20, termsY)
    doc.setFont('times', 'normal')
    doc.text('Payment is due within the specified due date.', 20, termsY + 5)
    doc.text('Please make checks payable to the company name.', 20, termsY + 10)
    
    // Footer with decorative border
    const pageHeight = doc.internal.pageSize.height
    doc.setLineWidth(0.5)
    doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25)
    doc.setLineWidth(3)
    doc.line(15, pageHeight - 22, pageWidth - 15, pageHeight - 22)
    
    doc.setFontSize(8)
    doc.setFont('times', 'italic')
    doc.text(
      'Thank you for your business',
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    )
    
    return doc
  }, []);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) return
        const res = await fetch(`http://localhost:3000/invoice/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setInvoice(data)
          const doc = generatePdf(data)
          if (doc) {
            setPdfUrl(doc.output('datauristring'))
          }
        }
      } catch (error) {
        console.error("Error fetching invoice:", error)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchInvoice()
    }
  }, [id, generatePdf]);

  const handleDownload = () => {
    if (!invoice) return
    
    try {
      setDownloading(true)
      const doc = generatePdf(invoice)
      if (doc) {
        doc.save(`invoice-${invoice.id}.pdf`)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setDownloading(false)
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Invoice not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoice Details</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? "Generating PDF..." : "Download Bill"}
          </Button>
          <BackButton />
        </div>
      </div>
      
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Invoice #{invoice.id}</span>
            <Badge
              className={
                invoice.status === "PENDING"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }
            >
              {invoice.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Client Name</p>
              <p className="font-semibold">{invoice.client.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Invoice Date</p>
              <p className="font-semibold">{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Due Date</p>
              <p className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="font-semibold text-lg">₹{invoice.amount.toLocaleString()}</p>
            </div>
          </div>
          {invoice.description && (
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="font-semibold">{invoice.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {pdfUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe src={pdfUrl} width="100%" height="600px" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
