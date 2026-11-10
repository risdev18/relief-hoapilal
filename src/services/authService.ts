// Authentication and Returning Customer Session Management

export interface PatientUser {
  name: string;
  fullName: string;
  email: string;
  phone: string;
  uhid: string;
  bloodGroup: string;
  dob: string;
  gender: string;
  abhaId: string;
  emergencyContact: string;
  isLoggedIn: boolean;
  lastLoginAt: string;
}

const DEFAULT_RETURNING_PATIENT: PatientUser = {
  name: 'Rahul Vinod Mehta',
  fullName: 'Rahul Vinod Mehta',
  email: 'rahul.mehta@email.com',
  phone: '+91 98201 12345',
  uhid: 'RH26-00192',
  bloodGroup: 'B+',
  dob: '14/06/1988',
  gender: 'Male',
  abhaId: '91-4820-1920-4491',
  emergencyContact: 'Sunita Mehta (+91 98201 54321)',
  isLoggedIn: true,
  lastLoginAt: new Date().toISOString(),
};

const SESSION_KEY = 'relif_active_patient';

export class AuthService {
  static getActivePatient(): PatientUser {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with realistic returning customer record so portfolio visitor immediately experiences full data continuity
      localStorage.setItem(SESSION_KEY, JSON.stringify(DEFAULT_RETURNING_PATIENT));
      return DEFAULT_RETURNING_PATIENT;
    } catch {
      return DEFAULT_RETURNING_PATIENT;
    }
  }

  static loginPatient(emailOrPhone: string, uhid?: string): PatientUser {
    const current = this.getActivePatient();
    const updated: PatientUser = {
      ...current,
      email: emailOrPhone.includes('@') ? emailOrPhone : current.email,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : current.phone,
      uhid: uhid || current.uhid,
      isLoggedIn: true,
      lastLoginAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('relif_auth_state_changed'));
    } catch {}
    return updated;
  }

  static logoutPatient(): void {
    const current = this.getActivePatient();
    const updated: PatientUser = {
      ...current,
      isLoggedIn: false,
    };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('relif_auth_state_changed'));
    } catch {}
  }

  static updatePatientProfile(data: Partial<PatientUser>): PatientUser {
    const current = this.getActivePatient();
    const updated: PatientUser = {
      ...current,
      ...data,
    };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('relif_auth_state_changed'));
    } catch {}
    return updated;
  }
}
