/**
 * Validation schemas using Zod for type-safe form handling
 */

import { z } from "zod";

// Customer information validation
export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
});

// Booking details validation
export const bookingSchema = z.object({
  brandSlug: z.string().min(1, "Brand is required"),
  serviceId: z.number().positive("Service is required"),
  serviceVariant: z.string().optional(),
  scheduledDate: z.string().refine((date) => {
    const parsed = new Date(date);
    return parsed > new Date();
  }, "Scheduled date must be in the future"),
  duration: z.number().positive("Duration must be positive"),
  address: z.string().min(10, "Address must be at least 10 characters").max(500),
  notes: z.string().max(1000).optional(),
});

// Combined booking form validation
export const bookingFormSchema = customerSchema.merge(bookingSchema);

// Payment proof validation
export const paymentProofSchema = z.object({
  bookingId: z.number().positive(),
  referenceNumber: z.string().min(1, "Reference number is required").max(100),
  bankAccount: z.string().min(1, "Bank account is required").max(100),
  amount: z.number().positive("Amount must be positive"),
});

// Admin verification schema
export const verificationSchema = z.object({
  paymentId: z.number().positive(),
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().optional(),
});

// Service creation/update schema (admin)
export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required").max(100),
  description: z.string().max(1000),
  basePrice: z.number().positive("Price must be positive"),
  duration: z.number().positive("Duration must be positive"),
  isActive: z.boolean().default(true),
  variants: z.array(z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive(),
    description: z.string().max(500).optional(),
  })).optional(),
});

// Brand creation/update schema (admin)
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(50).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000),
  isActive: z.boolean().default(true),
});

// Query parameter validation
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().positive()).default("1"),
  limit: z.string().transform(Number).pipe(z.number().positive().max(100)).default("10"),
});

export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
});

// Type exports for better TypeScript integration
export type CustomerData = z.infer<typeof customerSchema>;
export type BookingData = z.infer<typeof bookingSchema>;
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type PaymentProofData = z.infer<typeof paymentProofSchema>;
export type VerificationData = z.infer<typeof verificationSchema>;
export type ServiceData = z.infer<typeof serviceSchema>;
export type BrandData = z.infer<typeof brandSchema>;

/**
 * Utility function to safely parse and validate data
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with parsed data or errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "Validation failed" } };
  }
}
