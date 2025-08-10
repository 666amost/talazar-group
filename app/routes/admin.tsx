/**
 * Admin dashboard for managing bookings, payments, and services
 */

import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Dashboard - Talazar Group" },
    { name: "description", content: "Manage bookings, payments, and services" },
  ];
};

// Simple authentication check
const authenticateAdmin = (request: Request) => {
  const auth = request.headers.get("Authorization");
  if (!auth) {
    throw new Error("Unauthorized");
  }
  
  const encoded = auth.replace("Basic ", "");
  const decoded = atob(encoded);
  const [username, password] = decoded.split(":");
  
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  if (username !== adminUsername || password !== adminPassword) {
    throw new Error("Unauthorized");
  }
};

export const loader = ({ request }: LoaderFunctionArgs) => {
  authenticateAdmin(request);
  
  // Mock data - in real app, fetch from database
  const bookings = [
    {
      id: 1,
      bookingNumber: "PUFFY-1234567890",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "081234567890",
      brandSlug: "puffy",
      service: "Premium Package",
      scheduledDate: "2025-08-15T09:00:00Z",
      address: "Jl. Sudirman No. 123, Jakarta",
      amount: 200000,
      status: "confirmed",
      paymentStatus: "verified",
      createdAt: "2025-08-10T10:00:00Z",
    },
    {
      id: 2,
      bookingNumber: "LAVA-1234567891",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "081234567891",
      brandSlug: "lava",
      service: "Express Car Wash",
      scheduledDate: "2025-08-16T14:00:00Z",
      address: "Jl. Thamrin No. 456, Jakarta",
      amount: 150000,
      status: "pending",
      paymentStatus: "awaiting_review",
      createdAt: "2025-08-10T11:00:00Z",
    },
  ];
  
  const payments = [
    {
      id: 1,
      bookingId: 2,
      bookingNumber: "LAVA-1234567891",
      customerName: "Jane Smith",
      amount: 150000,
      proofUrl: "/uploads/payment-proof-123.jpg",
      referenceNumber: "TRF123456789",
      bankAccount: "BCA - 1234567890",
      verificationStatus: "pending",
      createdAt: "2025-08-10T12:00:00Z",
    },
  ];
  
  const stats = {
    totalBookings: 2,
    pendingPayments: 1,
    todayRevenue: 200000,
    thisMonthRevenue: 350000,
  };
  
  return json({ bookings, payments, stats });
};

type ActionData = { success?: boolean; message?: string; error?: string };

export const action = async ({ request }: ActionFunctionArgs) => {
  authenticateAdmin(request);
  
  const formData = await request.formData();
  const action = formData.get("_action");
  
  if (action === "verify_payment") {
    const paymentId = formData.get("paymentId");
    const status = formData.get("status");
    const reason = formData.get("reason");
    
    // In real app, update database
    console.log("Payment verification:", { paymentId, status, reason });
    
  return json<ActionData>({ success: true, message: "Payment status updated" });
  }
  
  if (action === "update_booking") {
    const bookingId = formData.get("bookingId");
    const status = formData.get("status");
    
    // In real app, update database
    console.log("Booking status update:", { bookingId, status });
    
    return json<ActionData>({ success: true, message: "Booking status updated" });
  }
  
  return json<ActionData>({ error: "Invalid action" }, { status: 400 });
};

export default function AdminDashboard() {
  const { bookings, payments, stats } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logos/Talazarlogo.png" alt="Talazar" className="h-8 w-auto" />
              <h1 className="text-2xl font-bold text-gray-900">Talazar Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {actionData?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{actionData.message}</p>
          </div>
        )}
        
        {actionData?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{actionData.error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", name: "Overview" },
              { id: "bookings", name: "Bookings" },
              { id: "payments", name: "Payment Verification" },
              { id: "services", name: "Services" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingPayments}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Today Revenue</h3>
                <p className="text-3xl font-bold text-green-600">
                  Rp {stats.todayRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Month Revenue</h3>
                <p className="text-3xl font-bold text-blue-600">
                  Rp {stats.thisMonthRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.brandSlug.toUpperCase()} - {booking.service}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        Rp {booking.amount.toLocaleString()}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        booking.status === "confirmed" 
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                          <p className="text-sm text-gray-500">{booking.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{booking.service}</p>
                          <p className="text-sm text-gray-500">{booking.brandSlug.toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rp {booking.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          booking.status === "confirmed" 
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Form method="post" className="inline">
                          <input type="hidden" name="_action" value="update_booking" />
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <select
                            name="status"
                            onChange={(e) => e.target.form?.requestSubmit()}
                            defaultValue={booking.status}
                            className="text-sm border-gray-300 rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </Form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Verification Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Payment Verification</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <div key={payment.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Booking: {payment.bookingNumber}</h4>
                          <p className="text-sm text-gray-600">Customer: {payment.customerName}</p>
                          <p className="text-sm text-gray-600">Amount: Rp {payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Reference: {payment.referenceNumber}</p>
                          <p className="text-sm text-gray-600">Bank: {payment.bankAccount}</p>
                        </div>
                        <div>
                          {payment.proofUrl && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Payment Proof:</p>
                              <img 
                                src={payment.proofUrl} 
                                alt="Payment proof"
                                className="w-32 h-32 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Form method="post" className="flex items-center space-x-4">
                        <input type="hidden" name="_action" value="verify_payment" />
                        <input type="hidden" name="paymentId" value={payment.id} />
                        
                        <select name="status" className="border-gray-300 rounded text-sm">
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                        
                        <input
                          type="text"
                          name="reason"
                          placeholder="Reason (if rejecting)"
                          className="border-gray-300 rounded text-sm flex-1"
                        />
                        
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Submit
                        </button>
                      </Form>
                    </div>
                  </div>
                </div>
              ))}
              
              {payments.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No pending payment verifications
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Service Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add Service
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center">Service management interface coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
