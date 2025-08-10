/**
 * Thank you page after successful booking
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getBrandFromPath, isValidBrand } from "~/lib/brand-config";

export const meta: MetaFunction = () => {
  return [
    { title: "Booking Confirmed - Talazar Group" },
    { name: "description", content: "Your booking has been confirmed" },
  ];
};

export const loader = ({ params, request }: LoaderFunctionArgs) => {
  const { brand: brandSlug } = params;
  
  if (!brandSlug || !isValidBrand(brandSlug)) {
    throw new Error("Brand not found");
  }
  
  const brand = getBrandFromPath(`/${brandSlug}`);
  const url = new URL(request.url);
  const bookingNumber = url.searchParams.get("booking");
  
  // In a real app, fetch booking details from database
  const mockBooking = {
    bookingNumber: bookingNumber || "PUFFY-1234567890",
    invoiceNumber: `INV-${bookingNumber || "PUFFY-1234567890"}`,
    customerName: "John Doe",
    service: "Premium Package",
    scheduledDate: "2025-08-15",
    amount: 200000,
    status: "pending",
    paymentStatus: "awaiting_payment"
  };
  
  const bankDetails = {
    name: "BCA",
    accountName: "PT Talazar Group", 
    accountNumber: "1234567890"
  };
  
  return json({ brand, booking: mockBooking, bankDetails });
};

export default function ThankYou() {
  const { brand, booking, bankDetails } = useLoaderData<typeof loader>();

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
                {brand.name}
              </h1>
            </div>
            <Link 
              to={`/${brand.slug}`}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: brand.primaryColor }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for choosing {brand.name}. Your booking has been received and an invoice has been generated.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Number</label>
              <p className="text-lg font-mono font-semibold" style={{ color: brand.primaryColor }}>
                {booking.bookingNumber}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <p className="text-lg font-mono font-semibold">{booking.invoiceNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <p className="text-lg">{booking.service}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
              <p className="text-lg">{new Date(booking.scheduledDate).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {booking.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
              <p className="text-2xl font-bold" style={{ color: brand.primaryColor }}>
                Rp {booking.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Payment Instructions</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-blue-200">
              <span className="font-medium text-blue-800">Bank:</span>
              <span className="font-bold text-blue-900">{bankDetails.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-blue-200">
              <span className="font-medium text-blue-800">Account Name:</span>
              <span className="font-bold text-blue-900">{bankDetails.accountName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-blue-200">
              <span className="font-medium text-blue-800">Account Number:</span>
              <span className="font-bold font-mono text-blue-900">{bankDetails.accountNumber}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-blue-100 rounded px-4">
              <span className="font-bold text-blue-900">Amount to Transfer:</span>
              <span className="text-xl font-bold text-blue-900">
                Rp {booking.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Next Steps:</h4>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center mr-3" style={{ backgroundColor: brand.primaryColor }}>1</span>
                Make the bank transfer to the account details above
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center mr-3" style={{ backgroundColor: brand.primaryColor }}>2</span>
                Take a screenshot or photo of the transfer receipt
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center mr-3" style={{ backgroundColor: brand.primaryColor }}>3</span>
                Upload your payment proof using the button below
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center mr-3" style={{ backgroundColor: brand.primaryColor }}>4</span>
                Wait for payment verification (usually within 2-4 hours)
              </li>
            </ol>
          </div>

          <Link
            to={`/payment/upload?booking=${booking.bookingNumber}`}
            className="inline-flex items-center justify-center w-full py-4 px-6 text-lg font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            style={{ backgroundColor: brand.primaryColor }}
          >
            Upload Payment Proof
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </Link>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-yellow-900 mb-3">Important Notes:</h4>
          <ul className="space-y-2 text-yellow-800 text-sm">
            <li>• Please transfer the exact amount as shown above</li>
            <li>• Your booking will be confirmed once payment is verified</li>
            <li>• We will contact you 1 day before your scheduled service</li>
            <li>• For any questions, please contact our customer support</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our customer support team is here to assist you with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-green-500 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp Support
            </a>
            <a
              href="mailto:support@talazargroup.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
