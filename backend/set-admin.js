const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.update({
      where: { email: 'joyempireofforex@gmail.com' },
      data: { role: 'admin' },
    });
    console.log('✅ User updated:', user.email, 'Role:', user.role);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
