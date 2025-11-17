import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any): Promise<any> {
    const where: any = {};

    if (filters.project) {
      where.booking = { ...where.booking, projectId: filters.project };
    }
    if (filters.broker) {
      where.booking = { ...where.booking, brokerId: filters.broker };
    }
    if (filters.tower) {
      where.booking = { ...where.booking, property: { tower: filters.tower } };
    }
    if (filters.floor) {
      where.booking = { ...where.booking, property: { floor: filters.floor } };
    }
    if (filters.employee) {
      where.booking = { ...where.booking, salesEmployeeId: filters.employee };
    }
    if (filters.name) {
      where.booking = { ...where.booking, client: { name: { contains: filters.name, mode: 'insensitive' } } };
    }
    if (filters.unitNo) {
      where.booking = { ...where.booking, property: { unitNumber: filters.unitNo } };
    }
    if (filters.formNo) {
      where.booking = { ...where.booking, formNo: filters.formNo };
    }
    if (filters.registrationNo) {
      where.booking = { ...where.booking, registrationNo: filters.registrationNo };
    }
    if (filters.bookingDate) {
      where.booking = { ...where.booking, applicationDate: { gte: new Date(filters.bookingDate) } };
    }

    const data = await this.prisma.applicantPaymentFile.findMany({
      where,
      include: {
        booking: {
          include: {
            project: true,
            client: true,
            property: true,
            broker: true,
            salesEmployee: true,
            paymentPlan: true,
          },
        },
      },
    });

    const formattedData = data.map((item) => ({
      id: item.id,
      bookingNo: item.booking.registrationNo,
      mobileNo: item.booking.client.phone,
      email: item.booking.client.email,
      agreementDate: item.booking.applicationDate,
      unitType: item.booking.property.type,
      tower: item.booking.property.tower,
      floor: item.booking.property.floor,
      unitNo: item.booking.property.unitNumber,
      plan: item.booking.paymentPlan?.planName,
      broker: item.booking.broker?.name,
      mainBroker: item.booking.broker?.name, // Assuming main broker is the same as broker
      employee: item.booking.salesEmployee.name,
      loan: item.booking.finance ? 'Yes' : 'No',
      bank: item.booking.finance ? item.booking.finance['bankName'] : '-',
      rank: '-', // No rank field in the schema
      signedArea: item.booking.property.area,
      carpetArea: item.booking.property.area, // Assuming carpet area is the same as signed area
      builtUpArea: item.booking.property.area, // Assuming built-up area is the same as signed area
      rate: item.booking.basicPrice,
      afterDiscountRate: item.booking.basicPrice, // Assuming no discount for now
      netPrice: item.booking.basicPrice, // Assuming no other costs for now
      discount: 0, // Assuming no discount for now
      otherCost: 0, // Assuming no other costs for now
      globalCost: 0, // Assuming no global costs for now
      costSgst: 0, // Assuming no GST for now
      costCgst: 0, // Assuming no GST for now
      totalCost: item.booking.basicPrice, // Assuming no other costs or GST for now
      duesCost: item.duesCost,
      duesSgst: item.duesSgst,
      duesCgst: item.duesCgst,
      totalDues: item.totalDues,
      receivedAmount: item.receivedAmount,
      receivedSgst: item.receivedSgst,
      receivedCgst: item.receivedCgst,
      totalReceived: item.totalReceived,
      receivedPercentage: item.receivedPercentage,
      creditAmount: item.creditAmount,
      creditSgst: item.creditSgst,
      creditCgst: item.creditCgst,
      totalCredit: item.totalCredit,
      outstandingAmount: item.outstandingAmount,
      outstandingSgst: item.outstandingSgst,
      outstandingCgst: item.outstandingCgst,
      totalOutstanding: item.totalOutstanding,
      balanceReceivable: item.balanceReceivable,
      interestReceived: item.interestReceived,
      interestOutstanding: item.interestOutstanding,
      interestWaived: item.interestWaived,
    }));

    return formattedData;
  }

  async unitStatus(filters: any): Promise<any> {
    const where: any = {};
    if (filters.project) {
      where.projectId = filters.project;
    }
    if (filters.tower) {
      where.tower = filters.tower;
    }
    if (filters.floor) {
      where.floor = filters.floor;
    }
    if (filters.unitNo) {
      where.unitNumber = filters.unitNo;
    }

    const properties = await this.prisma.property.findMany({
      where,
      include: {
        bookings: {
          include: {
            client: true,
            broker: true,
          },
        },
      },
    });

    const formattedData = properties.map((property, index) => {
      const booking = property.bookings[0]; // Assuming one booking per property for simplicity
      return {
        s_no: index + 1,
        registration_no: booking?.registrationNo || '-',
        name: booking?.client.name || 'Available',
        client_id: booking?.client.id || null,
        tower: property.tower,
        floor: property.floor,
        group: '-', // No group field in the schema
        unit_type: property.type,
        area: property.area,
        super_area: property.area, // Assuming super area is the same as area
        carpet_area: property.area, // Assuming carpet area is the same as area
        plot_area: 0, // No plot area field in the schema
        unit_no: property.unitNumber,
        location: property.location,
        broker: booking?.broker?.name || '-',
        status: booking ? booking.status : property.status,
        status_date: booking?.applicationDate.toLocaleDateString() || '-',
      };
    });

    return formattedData;
  }
}
