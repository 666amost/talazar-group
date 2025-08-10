/**
 * Brand services listing page
 */

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getBrandFromPath, isValidBrand, type Brand } from "~/lib/brand-config";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.brand) {
    return [{ title: "Services Not Found" }];
  }
  
  return [
    { title: `${data.brand.name} - Layanan Kami` },
    { name: "description", content: `Jelajahi berbagai layanan premium dari ${data.brand.name}` },
  ];
};

// Mock service data - in real app this would come from database
const getServicesForBrand = (brandSlug: string) => {
  const baseServices = {
    puffy: [
      {
        id: 1,
        name: "Cotton Candy Classic",
        description: "Cotton candy tradisional dengan berbagai rasa premium",
        basePrice: "75000",
        duration: 90,
        slug: "cotton-candy-classic",
        features: ["5 rasa pilihan", "Setup & cleanup", "Staff profesional"]
      },
      {
        id: 2,
        name: "Cotton Candy Premium",
        description: "Paket lengkap dengan rasa eksklusif dan dekorasi menarik",
        basePrice: "125000",
        duration: 120,
        slug: "cotton-candy-premium", 
        features: ["10 rasa pilihan", "Dekorasi cantik", "Photo booth", "Staff profesional"]
      },
      {
        id: 3,
        name: "Sweet Party Package",
        description: "Kombinasi cotton candy dengan permen artisanal lainnya",
        basePrice: "200000",
        duration: 150,
        slug: "sweet-party-package",
        features: ["Cotton candy unlimited", "Permen artisanal", "Dekorasi tema", "2 staff profesional"]
      }
    ],
    lava: [
      {
        id: 1,
        name: "Choco Pop Basic",
        description: "Camilan cokelat hangat untuk acara kecil",
        basePrice: "100000", 
        duration: 60,
        slug: "choco-pop-basic",
        features: ["3 varian rasa", "Setup peralatan", "Staff profesional"]
      },
      {
        id: 2,
        name: "Choco Pop Deluxe",
        description: "Pengalaman cokelat premium dengan berbagai topping",
        basePrice: "175000",
        duration: 90,
        slug: "choco-pop-deluxe",
        features: ["5 varian rasa", "10+ topping pilihan", "Packaging menarik", "Staff profesional"]
      },
      {
        id: 3,
        name: "Warm Treats Festival",
        description: "Paket lengkap camilan hangat untuk acara besar",
        basePrice: "300000",
        duration: 180,
        slug: "warm-treats-festival",
        features: ["Unlimited choco pop", "Hot snacks variety", "Live cooking station", "2 staff profesional"]
      }
    ],
    indomie: [
      {
        id: 1,
        name: "Indomie Party Starter",
        description: "Pesta mi instan seru untuk gathering kecil",
        basePrice: "150000",
        duration: 90,
        slug: "indomie-party-starter",
        features: ["5 varian Indomie", "Topping dasar", "Peralatan lengkap", "Staff profesional"]
      },
      {
        id: 2,
        name: "Indomie Party Deluxe", 
        description: "Pengalaman kuliner interaktif dengan beragam varian",
        basePrice: "250000",
        duration: 120,
        slug: "indomie-party-deluxe",
        features: ["10+ varian Indomie", "15+ topping premium", "Live cooking", "Games & activities", "Staff profesional"]
      },
      {
        id: 3,
        name: "Ultimate Noodle Fest",
        description: "Festival mi instan terlengkap untuk acara spektakuler",
        basePrice: "400000",
        duration: 180,
        slug: "ultimate-noodle-fest",
        features: ["Semua varian Indomie", "Topping unlimited", "Live entertainment", "Photo corner", "2 staff profesional"]
      }
    ]
  };
  
  return baseServices[brandSlug as keyof typeof baseServices] || [];
};

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { brand: brandSlug } = params;
  
  if (!brandSlug || !isValidBrand(brandSlug)) {
    throw new Response("Brand not found", { status: 404 });
  }
  
  const brand = getBrandFromPath(`/${brandSlug}`);
  const services = getServicesForBrand(brandSlug);
  
  return json({ brand, services });
};

export default function BrandServices() {
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
              <Link to={`/${brand.slug}`} className="text-gray-600 hover:text-gray-900 mr-4 flex items-center text-sm lg:text-base">
                <span>← {brand.name}</span>
              </Link>
              <div className="flex items-center space-x-2">
                {brand.logo && (
                  <img src={brand.logo} alt={brand.name} className="h-6 lg:h-8 w-auto" />
                )}
                <h1 className="text-lg lg:text-xl font-bold" style={{ color: brand.primaryColor }}>
                  Layanan Kami
                </h1>
              </div>
            </div>
            <div className="flex space-x-4 lg:space-x-6">
              <Link 
                to={`/${brand.slug}/book`}
                className="text-white px-3 lg:px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm lg:text-base"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Pesan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div 
        className="relative py-16 lg:py-24"
        style={{ 
          backgroundImage: `linear-gradient(135deg, ${brand.primaryColor}15, ${brand.secondaryColor}15)` 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Layanan {brand.name}
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih paket layanan yang sesuai dengan kebutuhan acara Anda
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                    {service.name}
                  </h3>
                  <div 
                    className="w-3 h-3 lg:w-4 lg:h-4 rounded-full"
                    style={{ backgroundColor: brand.primaryColor }}
                  />
                </div>
                
                <p className="text-gray-600 mb-6 text-sm lg:text-base">
                  {service.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Yang Termasuk:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Duration */}
                <div className="flex items-center justify-between mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold" style={{ color: brand.primaryColor }}>
                      Rp {parseInt(service.basePrice).toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">Harga mulai dari</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg lg:text-xl font-semibold text-gray-900">{service.duration} menit</p>
                    <p className="text-xs lg:text-sm text-gray-500">Durasi layanan</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/${brand.slug}/book?service=${service.slug}`}
                  className="w-full inline-flex items-center justify-center py-3 lg:py-4 px-6 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1 text-sm lg:text-base"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  Pilih Paket Ini
                  <svg className="ml-2 w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Service CTA */}
        <div className="mt-12 lg:mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              Butuh Paket Khusus?
            </h3>
            <p className="text-gray-600 mb-6 text-sm lg:text-base">
              Kami dapat menyesuaikan layanan sesuai dengan kebutuhan spesifik acara Anda.
            </p>
            <Link
              to={`/${brand.slug}/book?custom=true`}
              className="inline-flex items-center py-3 lg:py-4 px-6 lg:px-8 border-2 font-semibold rounded-lg hover:shadow-lg transition-all text-sm lg:text-base"
              style={{ 
                borderColor: brand.primaryColor, 
                color: brand.primaryColor 
              }}
            >
              Konsultasi Gratis
              <svg className="ml-2 w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
