import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedProduction() {
  console.log('--- Starting Production Seed ---');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hospital.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisNow!123';

  try {
    const existingStaff = await prisma.staff.findUnique({
      where: { email: adminEmail },
    });

    if (existingStaff) {
      console.log('Admin user already exists. Skipping seed.');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminStaff = await prisma.staff.create({
        data: {
          email: adminEmail,
          first_name: 'Super',
          last_name: 'Admin',
          gender: 'MALE',
          date_of_birth: new Date('1980-01-01'),
          age: 46,
          phone_number: '0000000000',
          address: 'System',
          role: 'SUPER_ADMIN',
          approval_status: 'APPROVED',
          active_status: true,
          staff_id_format: 'HSP-SADM-0001',
          
          credential: {
            create: {
              linked_user_type: 'STAFF',
              username: 'superadmin',
              password_hash: hashedPassword,
            }
          }
        },
      });

      console.log('✅ Default super admin created.');
    }

    console.log('✅ Production seeding completed.');
  } catch (error) {
    console.error('❌ Production seeding failed.', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedProduction();
}
