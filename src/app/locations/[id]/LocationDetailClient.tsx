'use client'

import { Button } from '../../../components/ui/button'
import { type LocationWithImages } from '@/types/menu'
import { HeroSection } from '../../../components/sections/HeroSection'
import ImageGallery from '../../../components/ImageGallery'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Navigation,
  Map,
  ArrowLeft,
  Search,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface MenuItemImage {
  id: number
  filename: string
  original_name: string
  file_size: number
  created_at: string
}

interface Location {
  id: number
  name: string
  address: string
  phone: string
  email: string
  hours: string
  description?: string
  features: string[]
  coordinates_lat?: number
  coordinates_lng?: number
  images: Array<{
    id: number
    filename: string
    original_name: string
    file_size: number
    is_primary: boolean
    created_at: string
  }>
}

interface LocationDetailClientProps {
  location: LocationWithImages;
}

const LocationDetailClient = ({ location }: LocationDetailClientProps) => {
  const images = location.images || []
  const primaryImage = images.find(img => img.is_primary) || images[0]
  const galleryImages = images.filter(img => !img.is_primary)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <HeroSection
        title={location.name}
        subtitle={
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-6 h-6" />
            {location.address}
          </div>
        }
        description="Visit our location and experience authentic Indian cuisine in a warm and welcoming atmosphere"
        primaryButton={
          <Button
            variant="default"
            className="bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            onClick={() => window.open(`tel:${location.phone}`, '_blank')}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
        }
        secondaryButton={
          <Link href="/locations">
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Button>
          </Link>
        }
      />

      {/* Image Gallery Section */}
      <ImageGallery 
        images={location.images || []}
        title="Gallery"
        description={`Take a virtual tour of our ${location.name}`}
      />

      {/* Location Details */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact <span className="text-orange-600">Information</span></h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Address</p>
                    <p className="text-gray-600">{location.address}</p>
                  </div>
                </div>
                
                {location.phone && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <Phone className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Phone</p>
                      <a href={`tel:${location.phone}`} className="text-orange-600 hover:underline font-medium">{location.phone}</a>
                    </div>
                  </div>
                )}
                
                {location.email && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Email</p>
                      <a href={`mailto:${location.email}`} className="text-orange-600 hover:underline font-medium">{location.email}</a>
                    </div>
                  </div>
                )}
                
                {location.hours && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Opening Hours</p>
                      <p className="text-gray-600">{location.hours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                {location.coordinates_lat && location.coordinates_lng && (
                  <Button
                    variant="default"
                    className="w-full bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() => window.open(`https://maps.google.com/?q=${location.coordinates_lat},${location.coordinates_lng}`, '_blank')}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                )}
                {location.phone && (
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                    onClick={() => window.open(`tel:${location.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column - Description & Features */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">About This <span className="text-orange-600">Location</span></h2>
              
              {location.description && (
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {location.description}
                </p>
              )}

              {location.features && location.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Features & Amenities</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {location.features.split(',').map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg border border-accent/20">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <ImageGallery 
        images={location.images || []}
        title="Gallery"
        description={`Take a virtual tour of our ${location.name}`}
      />

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Us on <span className="text-orange-600">Map</span></h2>
            <p className="text-xl text-gray-600">Click below to get directions to {location.name}</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 flex items-center justify-center shadow-inner">
            <div className="text-center">
              <Map className="w-20 h-20 text-orange-600 mx-auto mb-6" />
              {location.coordinates_lat && location.coordinates_lng ? (
                <Button
                  size="lg"
                  variant="default"
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => window.open(`https://maps.google.com/?q=${location.coordinates_lat},${location.coordinates_lng}`, '_blank')}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Open in Google Maps
                </Button>
              ) : (
                <p className="text-gray-600 text-lg">Map coordinates not available</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/locations">
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white px-6 py-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Locations
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LocationDetailClient