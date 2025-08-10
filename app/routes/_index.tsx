/**
 * Landing page - Talazar Group brand selector
 */

import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { CandyIcon } from "~/components/icons/CandyIcon";
import { FlameSnackIcon } from "~/components/icons/FlameSnackIcon";
import { NoodleBowlIcon } from "~/components/icons/NoodleBowlIcon";
import { getAllBrands } from "~/lib/brand-config";

export const meta: MetaFunction = () => {
  return [
    { title: "Talazar Group - Premium Service Brands" },
    { name: "description", content: "Choose from our premium service brands: Puffy Clean, Lava Wash, and Indomie Catering" },
  ];
};

export default function Index() {
  const brands = getAllBrands();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-50 shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <img src="/logos/Talazarlogo.png" alt="Talazar Group" className="h-6 lg:h-8 w-auto" />
                <h1 className="text-lg lg:text-2xl font-bold text-blue-800">Talazar Group</h1>
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/about" className="text-blue-700 hover:text-blue-900 transition-colors font-medium">Tentang</Link>
              <Link to="/contact" className="text-blue-700 hover:text-blue-900 transition-colors font-medium">Kontak</Link>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-blue-700 hover:text-blue-900 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Talazar Group
            <span className="block text-blue-600 font-bold">
              Premium Food Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Kami menghadirkan pengalaman kuliner terbaik untuk acara Anda! Dari cotton candy artisanal yang lembut, 
            camilan cokelat premium yang hangat, hingga pesta mi instan yang seru dan interaktif. 
            Setiap brand kami mengkhususkan diri dalam memberikan kualitas terbaik dan pengalaman yang tak terlupakan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Bahan Premium
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Pelayanan Profesional
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Pengalaman Berkesan
            </div>
          </div>
        </div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {brands.map((brand) => (
            <Link 
              key={brand.slug}
              to={`/${brand.slug}`}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="p-6 lg:p-8">
                {/* Brand Logo */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 mb-4 lg:mb-6 flex items-center justify-center mx-auto">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Brand Info */}
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 text-center">
                  {brand.name}
                </h3>
                <p className="text-gray-600 mb-4 lg:mb-6 text-center text-sm lg:text-base">
                  {brand.description}
                </p>

                {/* Service Areas */}
                <div className="mb-4 lg:mb-6">
                  <h4 className="text-xs lg:text-sm font-semibold text-gray-900 mb-2 text-center">Layanan Tersedia:</h4>
                  <div className="flex flex-wrap gap-1 lg:gap-2 justify-center">
                    {brand.serviceAreas.slice(0, 2).map((area) => (
                      <span 
                        key={area}
                        className="text-xs px-2 lg:px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                      >
                        {area}
                      </span>
                    ))}
                    {brand.serviceAreas.length > 2 && (
                      <span className="text-xs px-2 lg:px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        +{brand.serviceAreas.length - 2} lagi
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <div 
                    className="inline-flex items-center text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-full group-hover:shadow-lg transition-all duration-300 text-sm lg:text-base"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    Jelajahi Layanan
                    <svg className="ml-1 lg:ml-2 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})` 
                }}
              />
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CandyIcon className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cita Rasa Artisanal</h3>
            <p className="text-gray-600 text-sm lg:text-base">Makanan & camilan premium yang dibuat segar untuk setiap acara dengan resep khusus.</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FlameSnackIcon className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Segar & Hangat</h3>
            <p className="text-gray-600 text-sm lg:text-base">Disajikan panas dan lezat—tekstur sempurna, rasa yang tak terlupakan.</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <NoodleBowlIcon className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Siap untuk Acara</h3>
            <p className="text-gray-600 text-sm lg:text-base">Dioptimalkan untuk pesta, perayaan, & pengalaman kuliner yang interaktif.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logos/Talazarlogo.png" alt="Talazar Group" className="h-8 w-auto" />
                <h3 className="text-xl font-bold">Talazar Group</h3>
              </div>
              <p className="text-blue-200">
                Menghadirkan pengalaman kuliner terbaik untuk setiap acara istimewa Anda.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Brand Kami</h4>
              <ul className="space-y-2">
                <li><Link to="/puffy" className="text-blue-200 hover:text-white transition-colors">Puffy Cotton Candy</Link></li>
                <li><Link to="/lava" className="text-blue-200 hover:text-white transition-colors">Lava Choco Pop</Link></li>
                <li><Link to="/indomie" className="text-blue-200 hover:text-white transition-colors">Indomie Party</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
              <div className="space-y-2 text-blue-200">
                <p>Email: info@talazargroup.com</p>
                <p>WhatsApp: +62 812-3456-7890</p>
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2025 Talazar Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
