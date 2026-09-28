/**
 * Security and Cryptographic Utilities for Patient Portal
 * Handles password hashing (SHA-256 via Web Crypto API with salt), input sanitization,
 * password strength scoring, and CSRF token generation.
 */

const SALT = 'dr_priyanka_bhandari_clinic_salt_2026_';

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(SALT + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, expectedHash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === expectedHash;
}

export function generateToken(prefix: string = 'tok'): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}_${Date.now()}_${randomHex}`;
}

export function generatePatientNumber(): string {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `PB-${year}-${randNum}`;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUpperCase && hasLowerCase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  let label: PasswordStrength['label'] = 'Very Weak';
  if (score === 1) label = 'Weak';
  if (score === 2) label = 'Fair';
  if (score === 3) label = 'Good';
  if (score >= 4) label = 'Strong';

  return {
    score,
    label,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar
  };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
}

export function validateMobile(mobile: string): boolean {
  // Accepts standard 10 digit Indian number or +91 format
  const cleaned = mobile.replace(/[\s-]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
}
