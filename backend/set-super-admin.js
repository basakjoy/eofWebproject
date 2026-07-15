const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const updated = await prisma.user.update({
      where: { email: 'joyempireofforex@gmail.com' },
      data: {
        role: 'admin',
        adminScope: 'SUPER_ADMIN',
        adminScopeGrantedAt: new Date(),
        adminScopeGrantedBy: 'system'
      },
      select: { id: true, email: true, role: true, adminScope: true }
    });
    console.log('User updated successfully:');
    console.log(JSON.stringify(updated, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
