import { supabase } from '@/integrations/supabase/client';

// HIPAA-compliant security utilities

/**
 * Logs audit trail for PHI access
 * Note: Backend triggers handle most audit logging automatically
 */
export const logDataAccess = async (
  action: string,
  tableName: string,
  recordId?: string
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.warn('No session found for audit logging');
      return;
    }

    // Call the backend audit logging function
    await supabase.rpc('log_audit', {
      p_action: action,
      p_table_name: tableName,
      p_record_id: recordId || null,
      p_old_data: null,
      p_new_data: null,
    });
  } catch (error) {
    // Don't throw - audit logging failure shouldn't break app
    console.error('Audit logging failed:', error);
  }
};

/**
 * Safely handles errors without exposing sensitive information
 */
export const sanitizeError = (error: any): string => {
  // In production, never expose detailed error messages
  if (import.meta.env.PROD) {
    return 'An error occurred. Please try again or contact support.';
  }

  // In development, show more details
  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Validates file uploads for security
 */
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF and image files (JPEG, PNG) are allowed' };
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /<script/i,
    /javascript:/i,
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    return { valid: false, error: 'Invalid file name' };
  }

  return { valid: true };
};

/**
 * Securely generates file names to prevent path traversal
 */
export const generateSecureFileName = (originalName: string, userId: string): string => {
  // Remove any path separators and special characters
  const cleanName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.+/g, '.')
    .toLowerCase();

  const timestamp = Date.now();
  const extension = cleanName.split('.').pop();
  
  return `${userId}/${timestamp}_${cleanName.substring(0, 50)}.${extension}`;
};

/**
 * Checks if the current session is still valid
 */
export const isSessionValid = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return false;
    }

    // Check if session is about to expire (within 5 minutes)
    const expiresAt = new Date(session.expires_at || 0).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (expiresAt - now < fiveMinutes) {
      // Attempt to refresh the session
      const { error: refreshError } = await supabase.auth.refreshSession();
      return !refreshError;
    }

    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

/**
 * Rate limiting helper (client-side basic implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export const checkRateLimit = (key: string, maxAttempts = 5, windowMs = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
};
