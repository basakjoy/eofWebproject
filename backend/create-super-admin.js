/**
 * Super Admin Creator Script
 * Run: node create-super-admin.js
 * This will create (or update) a super admin account in the database.
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = 'superadmin@eofweb.com';
const SUPER_ADMIN_PASSWORD = 'SuperAdmin@2024!';
const SUPER_ADMIN_NAME = 'Super Admin';

async function main() {
  console.log('🔧 Creating / updating super admin account...\n');

  const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      role: 'admin',
      adminScope: 'SUPER_ADMIN',
      adminScopeGrantedAt: new Date(),
      adminScopeGrantedBy: 'system',
    },
    create: {
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      adminScope: 'SUPER_ADMIN',
      adminScopeGrantedAt: new Date(),
      adminScopeGrantedBy: 'system',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      adminScope: true,
    },
  });

  console.log(' Super admin account ready!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' Email   :', SUPER_ADMIN_EMAIL);
  console.log(' Password:', SUPER_ADMIN_PASSWORD);
  console.log(' Role    :', user.role, '/', user.adminScope);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Use these credentials to log into the admin dashboard.');
}

main()
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
