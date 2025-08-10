/**
 * Multi-step booking wizard with manual bank transfer payment
 */

import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import React, { useState } from "react";
// Types for services used in wizard
interface ServiceVariant {
  name: string;
  price: number;
  description?: string;
}
interface ServiceItem {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  variants?: ServiceVariant[];
}
import { getBrandFromPath, isValidBrand } from "~/lib/brand-config";
import { rateLimit } from "~/lib/kv.server";
import { validateData, bookingFormSchema } from "~/lib/validation";

// Unified action data shape so optional fields exist regardless of branch
type ActionData = {
  errors?: Record<string, string>;
  error?: string;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Book Service - ${data?.brand?.name || "Talazar Group"}` },
    { name: "description", content: "Book your service with easy online booking" },
  ];
};

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { brand: brandSlug } = params;
  
  if (!brandSlug || !isValidBrand(brandSlug)) {
    throw new Error("Brand not found");
  }
  
  const brand = getBrandFromPath(`/${brandSlug}`);
  
  // Mock services data (would come from database)
  const services = [
    {
      id: 1,
      name: "Premium Package",
      description: "Comprehensive premium service",
      basePrice: 150000,
      duration: 120,
      variants: [
        { name: "Basic", price: 150000, description: "Standard package" },
        { name: "Deluxe", price: 200000, description: "Enhanced with premium features" },
        { name: "Ultimate", price: 250000, description: "All-inclusive luxury package" }
      ]
    },
    {
      id: 2,
      name: "Standard Service",
      description: "Quality service at affordable price",
      basePrice: 100000,
      duration: 90,
      variants: [
        { name: "Regular", price: 100000, description: "Standard service" },
        { name: "Plus", price: 130000, description: "Enhanced service" }
      ]
    }
  ];

  // Bank details for payment
  const bankDetails = {
    name: process.env.BANK_NAME || "BCA",
    accountName: process.env.BANK_ACCOUNT_NAME || "PT Talazar Group",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "1234567890"
  };
  
  return json({ brand, services, bankDetails });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { brand: brandSlug } = params;
  
  if (!brandSlug || !isValidBrand(brandSlug)) {
  return json<ActionData>({ error: "Invalid brand" }, { status: 400 });
  }

  // Rate limiting
  const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
  const rateCheck = await rateLimit(`booking:${clientIP}`, 3, 60000); // 3 requests per minute
  
  if (!rateCheck.allowed) {
    return json<ActionData>(
      { error: "Too many booking attempts. Please try again later." },
      { status: 429 }
    );
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  // Validate form data
  const validation = validateData(bookingFormSchema, {
    ...data,
    brandSlug,
    serviceId: parseInt(data.serviceId as string),
    duration: parseInt(data.duration as string),
  });
  
  if (!validation.success) {
    return json<ActionData>({ errors: validation.errors }, { status: 400 });
  }

  try {
    const bookingNumber = `${brandSlug.toUpperCase()}-${Date.now()}`;
    const invoiceNumber = `INV-${bookingNumber}`;
    void invoiceNumber; // placeholder to silence unused until persistence added
    return redirect(`/${brandSlug}/thank-you?booking=${bookingNumber}`);
  } catch (error) {
    console.error("Booking creation error:", error);
    return json<ActionData>({ error: "Failed to create booking. Please try again." }, { status: 500 });
  }
};

export default function BookingPage() {
  const { brand, services, bankDetails } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);

  const isSubmitting = navigation.state === "submitting";

  const steps = [
    { id: 1, name: "Service", description: "Choose your service" },
    { id: 2, name: "Schedule", description: "Pick date & time" },
    { id: 3, name: "Location", description: "Service address" },
    { id: 4, name: "Customer", description: "Your information" },
    { id: 5, name: "Payment", description: "Bank transfer details" },
    { id: 6, name: "Summary", description: "Review & confirm" },
  ];

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, steps.length));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  if (!brand) {
    return <div>Brand not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {brand.logo && (
                <img src={brand.logo} alt={brand.name} className="h-8 w-auto" />
              )}
              <h1 className="text-xl font-bold" style={{ color: brand.primaryColor }}>
                Book {brand.name}
              </h1>
            </div>
            <div className="text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? `border-[${brand.primaryColor}] bg-[${brand.primaryColor}] text-white`
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-20 h-0.5 ml-4 ${
                    currentStep > step.id ? `bg-[${brand.primaryColor}]` : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Form method="post" className="bg-white rounded-lg shadow-lg p-8">
          {actionData?.errors && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(actionData.errors).map(([field, errorMsg]) => (
                  <li key={field}>• {errorMsg}</li>
                ))}
              </ul>
            </div>
          )}

          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{actionData.error}</p>
            </div>
          )}

          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Service</h2>
              <div className="grid gap-6">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      selectedService?.id === service.id 
                        ? `border-[${brand.primaryColor}] bg-[${brand.secondaryColor}]`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: brand.primaryColor }}>
                          Rp {service.basePrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{service.duration} minutes</p>
                      </div>
                    </div>
                    
                    {selectedService?.id === service.id && service.variants && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-gray-900">Select Package:</h4>
                        {service.variants.map((variant) => (
                          <label key={variant.name} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="serviceVariant"
                              value={variant.name}
                              onChange={() => setSelectedVariant(variant)}
                              className="mr-3"
                              style={{ accentColor: brand.primaryColor }}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">{variant.name}</span>
                                <span className="font-bold" style={{ color: brand.primaryColor }}>
                                  Rp {variant.price.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{variant.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <input type="hidden" name="serviceId" value={selectedService?.id || ""} />
              <input type="hidden" name="duration" value={selectedService?.duration || ""} />
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  {(() => {
                    const dynamicStyle: React.CSSProperties & { ['--brand-color']?: string } = {
                      ['--brand-color']: brand.primaryColor,
                    };
                    return (
                  <input
                    type="date"
                    name="scheduledDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-[var(--brand-color)]"
                    style={dynamicStyle}
                  />
                    ); })()}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    name="preferredTime"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  >
                    <option value="">Select time</option>
                    <option value="08:00">08:00 AM</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Location</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={4}
                    placeholder="Enter your complete address including street, building, floor, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Any special instructions or notes for our team"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Customer Information */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g., 081234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment Information */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment via Bank Transfer</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-4">Bank Transfer Details</h3>
                <div className="space-y-2 text-blue-800">
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <span className="font-semibold">{bankDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Name:</span>
                    <span className="font-semibold">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span className="font-semibold font-mono">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2 mt-3">
                    <span>Amount to Transfer:</span>
                    <span className="font-bold text-lg">
                      Rp {selectedVariant?.price?.toLocaleString() || selectedService?.basePrice?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> After submitting this booking, you will receive an invoice. 
                  Please make the bank transfer and upload your payment proof to confirm your booking.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Summary */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    {selectedVariant && (
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-medium">{selectedVariant.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{selectedService?.duration} minutes</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total Amount:</span>
                      <span style={{ color: brand.primaryColor }}>
                        Rp {selectedVariant?.price?.toLocaleString() || selectedService?.basePrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4"
                    style={{ accentColor: brand.primaryColor }}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the terms and conditions and privacy policy
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !selectedService) ||
                  (currentStep === 1 && selectedService?.variants && !selectedVariant)
                }
                className="px-6 py-2 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
