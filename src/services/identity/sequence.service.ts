import { prisma } from '@/lib/db/prisma';

export const SequenceService = {
  /**
   * Atomically increments the sequence and returns the new value.
   * Optionally accepts a transaction client to participate in an existing transaction.
   */
  async getNextSequence(type: 'PATIENT' | 'STAFF', tx?: any): Promise<number> {
    const client = tx || prisma;
    
    // If we have a transaction client, use it directly without wrapping in $transaction
    if (tx) {
        return await this._performUpdate(type, client);
    }
    
    // Otherwise, create a new transaction
    return await prisma.$transaction(async (t: any) => {
        return await this._performUpdate(type, t);
    });
  },

  async _performUpdate(type: 'PATIENT' | 'STAFF', t: any): Promise<number> {
      if (type === 'PATIENT') {
        let seq = await t.patientSequence.findUnique({ where: { id: 1 } });
        if (!seq) {
          seq = await t.patientSequence.create({ data: { id: 1, last_number: 0 } });
        }
        const newNumber = seq.last_number + 1;
        await t.patientSequence.update({
          where: { id: 1 },
          data: { last_number: newNumber },
        });
        return newNumber;
      } else {
        let seq = await t.staffSequence.findUnique({ where: { id: 1 } });
        if (!seq) {
          seq = await t.staffSequence.create({ data: { id: 1, last_number: 0 } });
        }
        const newNumber = seq.last_number + 1;
        await t.staffSequence.update({
          where: { id: 1 },
          data: { last_number: newNumber },
        });
        return newNumber;
      }
  }
};
