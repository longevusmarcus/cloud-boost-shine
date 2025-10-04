import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters');

// Password validation schema (HIPAA requires strong passwords)
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Name validation
export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Test result validation schemas
export const testResultSchema = z.object({
  test_date: z.string().min(1, 'Test date is required'),
  provider: z.string().trim().max(255, 'Provider name too long').optional(),
  concentration: z.number().min(0).max(1000, 'Invalid concentration value').optional(),
  motility: z.number().min(0).max(100, 'Motility must be between 0-100%').optional(),
  progressive_motility: z.number().min(0).max(100, 'Progressive motility must be between 0-100%').optional(),
  motile_sperm_concentration: z.number().min(0).max(1000, 'Invalid value').optional(),
  progressive_motile_sperm_concentration: z.number().min(0).max(1000, 'Invalid value').optional(),
  morphology: z.number().min(0).max(100, 'Morphology must be between 0-100%').optional(),
  volume: z.number().min(0).max(20, 'Volume must be between 0-20ml').optional(),
  notes: z.string().max(5000, 'Notes must be less than 5000 characters').optional(),
});

// Daily log validation schema
export const dailyLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  sleep_hours: z.number().min(0).max(24, 'Sleep hours must be between 0-24').optional(),
  sleep_quality: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
  diet_quality: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
  stress_level: z.number().min(1).max(5, 'Stress level must be between 1-5').optional(),
  exercise_minutes: z.number().min(0).max(1440, 'Exercise minutes must be between 0-1440').optional(),
  masturbation_count: z.number().min(0).max(20, 'Invalid count').optional(),
  electrolytes: z.boolean().optional(),
  notes: z.string().max(5000, 'Notes must be less than 5000 characters').optional(),
});

// Profile validation schema
export const profileSchema = z.object({
  full_name: nameSchema.optional(),
  age: z.number().min(18, 'Must be 18 or older').max(120, 'Invalid age').optional(),
  goal: z.string().max(500, 'Goal must be less than 500 characters').optional(),
});

// Helper function to sanitize error messages (avoid leaking sensitive info)
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Validation failed';
  }
  
  if (error instanceof Error) {
    // Don't leak database or system errors
    if (error.message.includes('duplicate key') || 
        error.message.includes('foreign key') ||
        error.message.includes('violates')) {
      return 'An error occurred while processing your request';
    }
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Helper to validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return { success: false, error: sanitizeErrorMessage(error) };
  }
}
