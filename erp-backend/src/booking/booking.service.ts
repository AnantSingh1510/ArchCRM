import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const {
      applicantFirstName,
      applicantLastName,
      applicantEmail1,
      applicantPanNo,
      presentAddress,
      officeAddress,
      permanentAddress,
      clientId,
      projectId,
      propertyId,
      salesEmployeeId,
      brokerId,
      paymentPlanId,
      companyDiscount,
      brokerDiscount,
      mailingAddress,
      communicationPreference,
      ...bookingData
    } = createBookingDto as any;

    let finalClientId = clientId;

    if (!clientId) {
      const newClient = await this.prisma.client.create({
        data: {
          name: `${applicantFirstName} ${applicantLastName}`,
          email: applicantEmail1,
          phone: '', // Add a placeholder or get from DTO
          panNumber: applicantPanNo,
          presentAddress: presentAddress ? JSON.parse(JSON.stringify(presentAddress)) : undefined,
          officeAddress: officeAddress ? JSON.parse(JSON.stringify(officeAddress)) : undefined,
          permanentAddress: permanentAddress ? JSON.parse(JSON.stringify(permanentAddress)) : undefined,
          mailingAddress: (createBookingDto as any).mailingAddress,
          communicationPreference: (createBookingDto as any).communicationPreference,
        },
      });
      finalClientId = newClient.id;
    }

    const bookingCreateData: Prisma.BookingCreateInput = {
      ...bookingData,
      client: { connect: { id: finalClientId } },
      project: { connect: { id: projectId } },
      property: { connect: { id: propertyId } },
      salesEmployee: { connect: { id: salesEmployeeId } },
      paymentPlan: { connect: { id: paymentPlanId } },
    };

    if (brokerId) {
      bookingCreateData.broker = { connect: { id: brokerId } };
    }
    if (companyDiscount) {
      bookingCreateData.companyDiscount = JSON.parse(JSON.stringify(companyDiscount));
    }
    if (brokerDiscount) {
      bookingCreateData.brokerDiscount = JSON.parse(JSON.stringify(brokerDiscount));
    }

    return this.prisma.booking.create({
      data: bookingCreateData,
    });
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: {
        project: true,
        property: true,
        client: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
       include: {
        project: true,
        property: true,
        client: true,
        salesEmployee: true,
        broker: true,
      },
    });
  }

  update(id: string, updateBookingDto: UpdateBookingDto) {
    const { clientId, projectId, propertyId, salesEmployeeId, brokerId, companyDiscount, brokerDiscount, ...bookingData } = updateBookingDto;

    const bookingUpdateData: Prisma.BookingUpdateInput = {
      ...bookingData,
    };

    if (clientId) bookingUpdateData.client = { connect: { id: clientId } };
    if (projectId) bookingUpdateData.project = { connect: { id: projectId } };
    if (propertyId) bookingUpdateData.property = { connect: { id: propertyId } };
    if (salesEmployeeId) bookingUpdateData.salesEmployee = { connect: { id: salesEmployeeId } };
    if (brokerId) bookingUpdateData.broker = { connect: { id: brokerId } };
    if (companyDiscount) bookingUpdateData.companyDiscount = JSON.parse(JSON.stringify(companyDiscount));
    if (brokerDiscount) bookingUpdateData.brokerDiscount = JSON.parse(JSON.stringify(brokerDiscount));

    return this.prisma.booking.update({
      where: { id },
      data: bookingUpdateData,
    });
  }

  remove(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
