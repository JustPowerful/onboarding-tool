import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminFirstname = process.env.ADMIN_FIRSTNAME;
const adminLastname = process.env.ADMIN_LASTNAME;

async function main() {
  if (adminEmail && adminPassword && adminFirstname && adminLastname) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: {
        email: adminEmail,
      },
      update: {},
      create: {
        firstname: adminFirstname,
        lastname: adminLastname,
        email: adminEmail,
        password: hashedPassword,
        role: "MANAGER",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
