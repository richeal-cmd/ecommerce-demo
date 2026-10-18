const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const customerPassword = await bcrypt.hash("Customer@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@demo.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@demo.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@demo.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });

  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: "Wireless Mouse", description: "Ergonomic 2.4GHz wireless mouse.", price: 1999, stock: 50, imageUrl: "https://picsum.photos/seed/mouse/400/300" },
        { name: "Mechanical Keyboard", description: "Compact keyboard with tactile switches.", price: 5999, stock: 30, imageUrl: "https://picsum.photos/seed/keyboard/400/300" },
        { name: "USB-C Hub", description: "7-in-1 hub with HDMI and card reader.", price: 3499, stock: 40, imageUrl: "https://picsum.photos/seed/hub/400/300" },
        { name: "Laptop Stand", description: "Adjustable aluminium stand.", price: 2499, stock: 25, imageUrl: "https://picsum.photos/seed/stand/400/300" },
        { name: "Noise-Cancelling Headphones", description: "Over-ear, 30-hour battery.", price: 8999, stock: 15, imageUrl: "https://picsum.photos/seed/headphones/400/300" },
        { name: "Webcam 1080p", description: "Full HD webcam with built-in mic.", price: 4499, stock: 20, imageUrl: "https://picsum.photos/seed/webcam/400/300" },
      ],
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());