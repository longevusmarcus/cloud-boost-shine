import { z } from 'zod';

// HIPAA-compliant input validation schemas

export const testResultSchema = z.object({
  test_date: z.string().min(1, "Test date is required"),
  provider: z.string().trim().max(100, "Provider name must be less than 100 characters").optional(),
  concentration: z.number()
    .min(0, "Concentration must be positive")
    .max(1000, "Concentration value seems unusually high")
    .optional(),
  motility: z.number()
    .min(0, "Motility must be between 0 and 100")
    .max(100, "Motility must be between 0 and 100")
    .optional(),
  progressive_motility: z.number()
    .min(0, "Progressive motility must be between 0 and 100")
    .max(100, "Progressive motility must be between 0 and 100")
    .optional(),
  morphology: z.number()
    .min(0, "Morphology must be between 0 and 100")
    .max(100, "Morphology must be between 0 and 100")
    .optional(),
  volume: z.number()
    .min(0, "Volume must be positive")
    .max(50, "Volume value seems unusually high")
    .optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

export const dailyLogSchema = z.object({
  date: z.string().min(1, "Date is required"),
  masturbation_count: z.number()
    .int("Must be a whole number")
    .min(0, "Count cannot be negative")
    .max(50, "Count seems unusually high")
    .optional(),
  sleep_hours: z.number()
    .min(0, "Sleep hours cannot be negative")
    .max(24, "Sleep hours cannot exceed 24")
    .optional(),
  sleep_quality: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
  diet_quality: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
  stress_level: z.number()
    .int("Must be a whole number")
    .min(1, "Stress level must be between 1 and 10")
    .max(10, "Stress level must be between 1 and 10")
    .optional(),
  exercise_minutes: z.number()
    .int("Must be a whole number")
    .min(0, "Exercise minutes cannot be negative")
    .max(1440, "Exercise minutes cannot exceed 24 hours")
    .optional(),
  electrolytes: z.boolean().optional(),
  alcohol: z.boolean().optional(),
  smoking: z.boolean().optional(),
  testosterone: z.boolean().optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

export const profileSchema = z.object({
  full_name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  age: z.number()
    .int("Age must be a whole number")
    .min(18, "You must be at least 18 years old")
    .max(120, "Please enter a valid age"),
  goal: z.string()
    .trim()
    .max(500, "Goal must be less than 500 characters")
    .optional(),
});

export const authSchema = z.object({
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z.string()
    .min(12, "Password must be at least 12 characters for HIPAA compliance")
    .max(72, "Password must be less than 72 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  full_name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
});

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
  // Remove potential XSS vectors
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const sanitizeNumber = (value: any): number | undefined => {
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

// Type exports
export type TestResultInput = z.infer<typeof testResultSchema>;
export type DailyLogInput = z.infer<typeof dailyLogSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AuthInput = z.infer<typeof authSchema>;
