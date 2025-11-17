import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('adminpassword', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      username: 'admin',
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create a test client
  const client = await prisma.client.upsert({
    where: { email: 'testclient@example.com' },
    update: {},
    create: {
      name: 'Test Client',
      email: 'testclient@example.com',
      phone: '1234567890',
    },
  });

  // Create a test project
  const project = await prisma.project.upsert({
    where: { id: 'clerk_project_1' },
    update: {},
    create: {
      id: 'clerk_project_1',
      name: 'Sunset Apartments',
      location: 'Mumbai',
    },
  });

  // Link client to project
  await prisma.clientsOnProjects.upsert({
    where: {
      projectId_clientId: {
        projectId: project.id,
        clientId: client.id,
      },
    },
    update: {},
    create: {
      projectId: project.id,
      clientId: client.id,
    },
  });

  // Create a test property
  await prisma.property.upsert({
    where: { id: 'clerk_property_1' },
    update: {
      totalAmount: 5000000,
    },
    create: {
      id: 'clerk_property_1',
      project: { connect: { id: project.id } },
      tower: 'A',
      floor: '10',
      unitNumber: '101',
      area: 1200,
      totalAmount: 5000000,
    },
  });

  // Create a future-dated invoice
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.invoice.create({
    data: {
      client: { connect: { id: client.id } },
      amount: 50000,
      date: new Date(),
      dueDate: tomorrow,
      status: 'PENDING',
    },
  });

  // Create a user for the test client
  const clientPassword = await bcrypt.hash('password', 10);
  await prisma.user.upsert({
    where: { email: 'testclient@example.com' },
    update: {
      password: clientPassword,
    },
    create: {
      username: 'testclient',
      email: 'testclient@example.com',
      name: 'Test Client',
      password: clientPassword,
      role: 'USER',
      clientId: client.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
