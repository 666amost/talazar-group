/**
 * Brand homepage - displays brand-specific hero and services overview
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getBrandFromPath, isValidBrand } from "~/lib/brand-config";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.brand) {
    return [{ title: "Brand Not Found" }];
  }
  
  return [
    { title: `${data.brand.name} - ${data.brand.description}` },
    { name: "description", content: data.brand.description },
  ];
};

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { brand: brandSlug } = params;
  
  if (!brandSlug || !isValidBrand(brandSlug)) {
    throw new Error("Brand not found");
  }
  
  const brand = getBrandFromPath(`/${brandSlug}`);
  
  // In a real app, you'd fetch services from database
  const mockServices = [
    {
      id: 1,
      name: "Premium Package",
      description: "Our comprehensive premium service",
      basePrice: "150000",
      duration: 120,
      slug: "premium-package"
    },
    {
      id: 2,
      name: "Standard Service",
      description: "Quality service at an affordable price",
      basePrice: "100000",
      duration: 90,
      slug: "standard-service"
    },
    {
      id: 3,
      name: "Express Service",
      description: "Quick and efficient service",
      basePrice: "80000",
      duration: 60,
      slug: "express-service"
    }
  ];
  
  return json({ brand, services: mockServices });
};

export default function BrandHome() {
  const { brand, services } = useLoaderData<typeof loader>();

  if (!brand) {
    return <div>Brand not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4 flex items-center text-sm lg:text-base">
                <img src="/logos/Talazarlogo.png" alt="Talazar" className="h-5 lg:h-6 w-auto mr-2" />
                <span>← Beranda</span>
              </Link>
              <div className="flex items-center space-x-2">
                {brand.logo && (
                  <img src={brand.logo} alt={brand.name} className="h-6 lg:h-8 w-auto" />
                )}
                <h1 className="text-lg lg:text-xl font-bold" style={{ color: brand.primaryColor }}>
                  {brand.name}
                </h1>
              </div>
            </div>
            <div className="flex space-x-3 lg:space-x-6">
              <Link 
                to={`/${brand.slug}/services`} 
                className="text-gray-600 hover:text-gray-900 text-sm lg:text-base hidden sm:block"
              >
                Layanan
              </Link>
              <Link 
                to={`/${brand.slug}/book`}
                className="text-white px-3 lg:px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm lg:text-base"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Pesan
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r"
        style={{ 
          backgroundImage: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})` 
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Brand Logo */}
            <div className="mb-6 lg:mb-8 flex justify-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`}
                  className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6">
              {brand.hero.title}
            </h1>
            <p className="text-lg lg:text-xl text-gray-100 mb-6 lg:mb-8 max-w-3xl mx-auto">
              {brand.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/${brand.slug}/book`}
                className="inline-flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold text-white bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-white border-opacity-20"
              >
                Pesan Layanan
                <svg className="ml-2 w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                to={`/${brand.slug}/services`}
                className="inline-flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold bg-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                style={{ color: brand.primaryColor }}
              >
                Lihat Layanan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our range of professional services designed to meet your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.name}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold" style={{ color: brand.primaryColor }}>
                    Rp {parseInt(service.basePrice).toLocaleString()}
                  </span>
                  <span className="text-gray-500 ml-2">starting from</span>
                </div>
                <div className="text-gray-500">
                  {service.duration} min
                </div>
              </div>

              <Link
                to={`/${brand.slug}/services/${service.slug}`}
                className="block w-full text-center py-3 px-4 rounded-lg font-semibold transition-all"
                style={{ 
                  backgroundColor: brand.secondaryColor,
                  color: brand.primaryColor 
                }}
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={`/${brand.slug}/services`}
            className="inline-flex items-center text-lg font-semibold hover:underline"
            style={{ color: brand.primaryColor }}
          >
            View All Services
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Areas</h2>
            <p className="text-gray-600">We proudly serve the following areas:</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {brand.serviceAreas.map((area) => (
              <span
                key={area}
                className="px-6 py-3 rounded-full text-white font-semibold"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="relative py-16"
        style={{ backgroundColor: brand.primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience {brand.name}?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Book your service today and discover why thousands of customers trust us.
          </p>
          <Link
            to={`/${brand.slug}/book`}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            style={{ color: brand.primaryColor }}
          >
            Book Now
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
