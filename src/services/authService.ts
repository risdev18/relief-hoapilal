// Authentication & Role-Aware Patient/Admin Profile Management
// Strict Supabase Auth (Password + Email OTP + Phone OTP) — ZERO demo users or mock sessions.

import { supabase } from '@/config/supabase';

export type UserRole = 'patient' | 'admin' | 'doctor' | 'reception';

export interface PatientUser {
  id: string;
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
  address?: string;
  city?: string;
  role: UserRole;
  isLoggedIn: boolean;
  lastLoginAt: string;
}

const SESSION_KEY = 'relif_active_profile_cache';

function generateUHID(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `RH26-${rand}`;
}

function generateABHA(): string {
  const p = () => Math.floor(1000 + Math.random() * 9000);
  return `91-${p()}-${p()}-${p()}`;
}

function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  return phone.startsWith('+') ? phone : `+${digits}`;
}

async function fetchOrCreateProfile(authUser: any): Promise<PatientUser> {
  const meta = authUser.user_metadata || {};
  let profileRow: any = null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!error && data) {
      profileRow = data;
    } else if (!error && !data) {
      const insertPayload = {
        id: authUser.id,
        email: authUser.email || null,
        phone: authUser.phone || meta.phone || '',
        full_name: meta.full_name || meta.name || (authUser.email ? authUser.email.split('@')[0] : 'Patient'),
        uhid: meta.uhid || generateUHID(),
        abha_id: meta.abha_id || generateABHA(),
        dob: meta.dob || '',
        gender: meta.gender || '',
        blood_group: meta.blood_group || '',
        role: 'patient',
      };
      const { data: created } = await supabase
        .from('profiles')
        .upsert(insertPayload)
        .select('*')
        .maybeSingle();
      profileRow = created || insertPayload;
    }
  } catch {
    // Graceful when profiles table hasn't been created in Supabase yet
  }

  const fullName =
    profileRow?.full_name ||
    meta.full_name ||
    meta.name ||
    (authUser.email ? authUser.email.split('@')[0] : 'Patient');

  const user: PatientUser = {
    id: authUser.id,
    name: fullName,
    fullName,
    email: profileRow?.email || authUser.email || '',
    phone: profileRow?.phone || authUser.phone || meta.phone || '',
    uhid: profileRow?.uhid || meta.uhid || generateUHID(),
    bloodGroup: profileRow?.blood_group || meta.blood_group || '',
    dob: profileRow?.dob || meta.dob || '',
    gender: profileRow?.gender || meta.gender || '',
    abhaId: profileRow?.abha_id || meta.abha_id || '',
    emergencyContact: profileRow?.emergency_contact || meta.emergency_contact || '',
    address: profileRow?.address || '',
    city: profileRow?.city || 'Mumbai',
    role: (profileRow?.role || meta.role || 'patient') as UserRole,
    isLoggedIn: true,
    lastLoginAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('relif_auth_state_changed'));
  return user;
}

// Keep local profile cache synced automatically when Supabase auth session changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || !session?.user) {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event('relif_auth_state_changed'));
    return;
  }
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
    void fetchOrCreateProfile(session.user);
  }
});

export class AuthService {
  static getActivePatient(): PatientUser | null {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return null;
      const parsed: PatientUser = JSON.parse(stored);
      return parsed.isLoggedIn && parsed.id ? parsed : null;
    } catch {
      return null;
    }
  }

  static async syncSession(): Promise<PatientUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        localStorage.removeItem(SESSION_KEY);
        window.dispatchEvent(new Event('relif_auth_state_changed'));
        return null;
      }
      return await fetchOrCreateProfile(session.user);
    } catch {
      return this.getActivePatient();
    }
  }

  static async signInWithSupabase(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: PatientUser }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid credentials.' };
      }

      const user = await fetchOrCreateProfile(data.user);
      return { success: true, user };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Unable to sign in right now.' };
    }
  }

  static async sendEmailOtp(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send email OTP.' };
    }
  }

  static async verifyEmailOtp(
    email: string,
    token: string
  ): Promise<{ success: boolean; error?: string; user?: PatientUser }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: 'email',
      });
      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid or expired OTP code.' };
      }
      const user = await fetchOrCreateProfile(data.user);
      return { success: true, user };
    } catch (err: any) {
      return { success: false, error: err?.message || 'OTP verification failed.' };
    }
  }

  static async sendPhoneOtp(phone: string): Promise<{ success: boolean; error?: string }> {
    try {
      const formatted = formatIndianPhone(phone);
      const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send SMS OTP.' };
    }
  }

  static async verifyPhoneOtp(
    phone: string,
    token: string
  ): Promise<{ success: boolean; error?: string; user?: PatientUser }> {
    try {
      const formatted = formatIndianPhone(phone);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formatted,
        token: token.trim(),
        type: 'sms',
      });
      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid SMS verification code.' };
      }
      const user = await fetchOrCreateProfile(data.user);
      return { success: true, user };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Phone OTP verification failed.' };
    }
  }

  static async signUpWithSupabase(params: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    dob?: string;
    gender?: string;
    bloodGroup?: string;
  }): Promise<{ success: boolean; needsEmailConfirm?: boolean; error?: string; user?: PatientUser }> {
    try {
      const uhid = generateUHID();
      const abhaId = generateABHA();
      const formattedPhone = formatIndianPhone(params.phone);

      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/patient/dashboard`,
          data: {
            full_name: params.fullName.trim(),
            phone: formattedPhone,
            uhid,
            abha_id: abhaId,
            dob: params.dob || '',
            gender: params.gender || '',
            blood_group: params.bloodGroup || '',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Registration could not be completed.' };
      }

      if (!data.session) {
        return { success: true, needsEmailConfirm: true };
      }

      const user = await fetchOrCreateProfile(data.user);
      return { success: true, needsEmailConfirm: false, user };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to complete registration.' };
    }
  }

  static async updatePatientProfile(data: Partial<PatientUser>): Promise<PatientUser | null> {
    const current = this.getActivePatient();
    if (!current) return null;

    const updated: PatientUser = {
      ...current,
      ...data,
      fullName: data.fullName ?? current.fullName,
      name: data.fullName ?? current.name,
    };

    try {
      await supabase
        .from('profiles')
        .update({
          full_name: updated.fullName,
          phone: updated.phone,
          dob: updated.dob,
          gender: updated.gender,
          blood_group: updated.bloodGroup,
          emergency_contact: updated.emergencyContact,
          address: updated.address,
          city: updated.city,
          updated_at: new Date().toISOString(),
        })
        .eq('id', current.id);

      await supabase.auth.updateUser({
        data: {
          full_name: updated.fullName,
          phone: updated.phone,
          dob: updated.dob,
          gender: updated.gender,
          blood_group: updated.bloodGroup,
          emergency_contact: updated.emergencyContact,
        },
      });
    } catch {
      // Cache updated locally if profiles table pending
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('relif_auth_state_changed'));
    return updated;
  }

  static async logoutPatient(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors on sign out
    }
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event('relif_auth_state_changed'));
  }
}
