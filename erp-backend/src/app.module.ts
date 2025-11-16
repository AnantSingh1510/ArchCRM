import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { PhaseModule } from './phase/phase.module';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ApprovalModule } from './approval/approval.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DocumentModule } from './document/document.module';
import { PropertyModule } from './property/property.module';
import { CommunicationModule } from './communication/communication.module';
import { PaymentModule } from './payment/payment.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [UserModule, ProjectModule, PhaseModule, TaskModule, PrismaModule, AuthModule, ClientModule, InvoiceModule, ApprovalModule, AnalyticsModule, DocumentModule, PropertyModule, CommunicationModule, PaymentModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
