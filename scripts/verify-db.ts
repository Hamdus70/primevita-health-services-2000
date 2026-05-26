import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const patientCount = await prisma.patient.count();
    console.log(`Total Patients: ${patientCount}`);

    if (patientCount > 0) {
      const patients = await prisma.patient.findMany({ take: 5 });
      patients.forEach(p => {
        console.log(`ID: ${p.id}, FirebaseUID: ${p.firebase_uid}`);
      });
    } else {
      console.log('No patients found.');
    }
  } catch (error) {
    console.error('Error verifying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
