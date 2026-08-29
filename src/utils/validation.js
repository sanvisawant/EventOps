import { ROLES } from './permissions';

/**
 * Validates score inputs against min/max rubric bounds
 */
export function validateScore(score, min = 0, max = 10) {
  const numeric = parseFloat(score);
  if (isNaN(numeric)) {
    return { isValid: false, error: 'Score must be a valid number' };
  }
  if (numeric < min || numeric > max) {
    return { isValid: false, error: `Score must be between ${min} and ${max}` };
  }
  return { isValid: true, value: numeric };
}

/**
 * Validates allowed user roles to prevent arbitrary escalation
 */
export function validateRole(role) {
  const allowedRoles = Object.values(ROLES);
  if (!role || !allowedRoles.includes(role)) {
    return { isValid: false, error: 'Invalid role selection. Must be PARTICIPANT, JUDGE, or ORGANIZER.' };
  }
  return { isValid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true };
}

/**
 * Validates password strength and confirmation match
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!password || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }
  return { isValid: true };
}

/**
 * Checks if a QR code has already been scanned/checked-in to prevent duplicates
 */
export function detectDuplicateCheckIn(qrCode, checkInLogs = []) {
  if (!qrCode || typeof qrCode !== 'string') {
    return { isDuplicate: false, error: 'Invalid QR code format' };
  }

  const existingLog = checkInLogs.find(
    (log) => log.qrCode?.trim().toUpperCase() === qrCode.trim().toUpperCase()
  );

  if (existingLog) {
    return {
      isDuplicate: true,
      existingLog,
      message: `Duplicate Check-In Detected! Scanned previously at ${new Date(existingLog.scannedAt).toLocaleTimeString()}`,
    };
  }

  return { isDuplicate: false };
}

/**
 * Validates a GitHub submission URL format
 */
export function validateGithubUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const regex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
  return regex.test(url.trim());
}

/**
 * Validates support ticket input fields
 */
export function validateSupportTicket({ title, category, priority }) {
  const errors = {};
  if (!title || title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long';
  }
  if (!category) {
    errors.category = 'Category selection is required';
  }
  if (!priority) {
    errors.priority = 'Priority level selection is required';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
