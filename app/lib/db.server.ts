/**
 * Database configuration using Drizzle ORM with Vercel Postgres
 * Defines the complete schema for the booking system
 */

import { sql } from "@vercel/postgres";
import {
  pgTable,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  jsonb,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";

// Initialize database connection
export const db = drizzle(sql);

// Brands table - manages different service brands
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services table - different service offerings per brand
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").references(() => brands.id),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  isActive: boolean("is_active").default(true),
  variants: jsonb("variants").$type<ServiceVariant[]>(), // pricing tiers
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table - main booking records
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").references(() => brands.id),
  serviceId: integer("service_id").references(() => services.id),
  bookingNumber: varchar("booking_number", { length: 20 }).notNull().unique(),
  
  // Customer information
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 100 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  
  // Service details
  serviceVariant: text("service_variant"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(),
  
  // Location
  address: text("address").notNull(),
  notes: text("notes"),
  
  // Pricing
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  // Status tracking
  status: varchar("status", { length: 20 }).default("pending"),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invoices table - generated invoices for bookings
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  invoiceNumber: varchar("invoice_number", { length: 20 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  pdfUrl: text("pdf_url"), // Vercel Blob URL
  status: varchar("status", { length: 20 }).default("unpaid"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments table - payment proof and verification
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  invoiceId: integer("invoice_id").references(() => invoices.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("bank_transfer"),
  proofUrl: text("proof_url"), // Vercel Blob URL for proof image
  bankAccount: varchar("bank_account", { length: 100 }),
  referenceNumber: varchar("reference_number", { length: 100 }),
  verificationStatus: varchar("verification_status", { length: 20 }).default("pending"),
  verifiedBy: varchar("verified_by", { length: 100 }),
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type definitions for better type safety
export interface ServiceVariant {
  name: string;
  price: number;
  description?: string;
}

export type BookingStatus = 
  | "pending" 
  | "confirmed" 
  | "in_progress" 
  | "completed" 
  | "cancelled";

export type PaymentStatus = 
  | "pending" 
  | "awaiting_review" 
  | "verified" 
  | "rejected" 
  | "refunded";

export type VerificationStatus = 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "requires_review";
