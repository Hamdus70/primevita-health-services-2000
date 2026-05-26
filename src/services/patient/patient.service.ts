import { prisma } from "@/lib/db/prisma";

export const PatientService = {
  getPatientById: async (id: string) => {
    return await prisma.patient.findUnique({ where: { id } });
  },
  searchPatients: async (args: { search: string; page: number; limit: number }) => {
    // Basic search implementation
    return await prisma.patient.findMany({
        where: {
            OR: [
                { first_name: { contains: args.search, mode: 'insensitive' } },
                { last_name: { contains: args.search, mode: 'insensitive' } },
            ]
        },
        skip: (args.page - 1) * args.limit,
        take: args.limit
    });
  }
};
