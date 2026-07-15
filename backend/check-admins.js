const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true, email: true, name: true, role: true, adminScope: true }
    });
    console.log('Admins in database:');
    console.log(JSON.stringify(admins, null, 2));
    
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, adminScope: true }
    });
    console.log('\nAll users:');
    console.log(JSON.stringify(allUsers, null, 2));
  } finally {
    await prisma.$disconnect();
  }
})();
