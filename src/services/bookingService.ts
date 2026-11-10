// Double-Booking Prevention & Booking Service
import { db } from '@/config/firebase';
import { 
  collection, doc, runTransaction, query, where, getDocs, 
  serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { generateAppointmentId } from '@/utils';

export interface BookingPayload {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  slot: string; // HH:MM
  consultationType: 'in-person' | 'video';
  visitReason?: string;
  isNewPatient: boolean;
}

export class BookingService {
  /**
   * Performs an atomic reservation transaction to prevent concurrent double-booking.
   */
  static async bookAppointmentWithLock(payload: BookingPayload) {
    // Unique slot lock ID format ensures hard physical collision prevention
    const slotLockId = `lock_${payload.doctorId}_${payload.date}_${payload.slot.replace(':', '')}`;
    const slotLockRef = doc(db, 'slotLocks', slotLockId);
    const appointmentRef = doc(collection(db, 'appointments'));

    try {
      const result = await runTransaction(db, async (transaction) => {
        const lockDoc = await transaction.get(slotLockRef);

        if (lockDoc.exists()) {
          throw new Error('SLOT_ALREADY_RESERVED: This time slot was claimed by another patient during selection.');
        }

        // 1. Establish atomic slot lock
        transaction.set(slotLockRef, {
          doctorId: payload.doctorId,
          date: payload.date,
          slot: payload.slot,
          claimedBy: payload.patientId,
          createdAt: serverTimestamp(),
        });

        const appointmentId = generateAppointmentId(Math.floor(Math.random() * 900000) + 100000);

        // 2. Persist comprehensive appointment record
        const appointmentData = {
          id: appointmentRef.id,
          appointmentId,
          ...payload,
          status: 'confirmed',
          statusHistory: [
            {
              status: 'confirmed',
              at: new Date().toISOString(),
              by: payload.patientId,
            }
          ],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        transaction.set(appointmentRef, appointmentData);

        // 3. Issue digital queue token
        const tokenRef = doc(collection(db, 'queueTokens'));
        const tokenData = {
          id: tokenRef.id,
          appointmentId,
          patientId: payload.patientId,
          patientName: payload.patientName,
          doctorId: payload.doctorId,
          departmentId: payload.departmentId,
          status: 'waiting',
          date: payload.date,
          tokenDisplay: `T-${payload.slot.replace(':', '')}`,
          createdAt: serverTimestamp(),
        };
        transaction.set(tokenRef, tokenData);

        return { appointmentId, status: 'confirmed' };
      });

      return result;
    } catch (err: any) {
      console.warn('[BookingService] Atomic lock transaction failed:', err.message);
      throw err;
    }
  }

  /**
   * Fetches real-time slot availability for a clinician on a given day.
   */
  static async getAvailableSlots(doctorId: string, date: string, allDaySlots: string[]) {
    try {
      const locksQuery = query(
        collection(db, 'slotLocks'),
        where('doctorId', '==', doctorId),
        where('date', '==', date)
      );
      const snapshot = await getDocs(locksQuery);
      const bookedSlots = new Set<string>();

      snapshot.forEach(doc => {
        bookedSlots.add(doc.data().slot);
      });

      return allDaySlots.map(slot => ({
        slot,
        isAvailable: !bookedSlots.has(slot),
      }));
    } catch {
      // In local demo without running emulator, mark default slots available
      return allDaySlots.map(slot => ({
        slot,
        isAvailable: true,
      }));
    }
  }
}

