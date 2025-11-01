'use client'

import { HeroSection } from '@/components/sections/HeroSection'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import MenuItemImageCarousel from '@/components/MenuItemImageCarousel'
import { motion, type Variants } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  ChevronRight,
  Navigation,
  Map
} from 'lucide-react'
import locationsHeroImage from '@/assets/hero/locations.jpg'
const locationsHeroImageString = locationsHeroImage.src
import Link from 'next/link'

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

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const Locations = () => {
  // Removed useNavigate as it's not being used properly in Next.js
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      if (response.ok) {
        const data = await response.json()
        setLocations(data)
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Loading locations...</div>
        </div>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className="min-h-screen">
        <HeroSection
          title="Visit Our Locations"
          subtitle="Experience authentic Indian cuisine at our convenient locations across Saudi Arabia"
          description="Find your nearest Indian Valley Restaurant and enjoy our warm hospitality and delicious dishes"
          primaryButton={<Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg">No Locations Available</Button>}
        />
        
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-lg">No locations are currently available. Please check back later.</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <HeroSection
        title={
          <div>
            Visit Our Locations
          </div>
        }
        subtitle="Experience authentic Indian cuisine at our convenient locations across Saudi Arabia"
        description="Find your nearest Indian Valley Restaurant and enjoy our warm hospitality and delicious dishes"
        backgroundImage={locationsHeroImageString}
        primaryButton={<Button size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-white text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">Find Nearest Location</Button>}
      />

      {/* Locations Grid */}
      <motion.section 
        className="py-20 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <Link href={`/locations/${location.id}`} key={location.id}>
              <motion.div 
                className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-accent/20"
                variants={itemVariants}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <MenuItemImageCarousel 
                    images={location.images || []}
                    className="w-full h-48"
                    showImageCount={false}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{location.name}</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{location.address}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{location.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{location.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{location.hours}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-accent/10 to-primary/10 text-accent text-xs rounded-full border border-accent/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-accent hover:bg-accent/90 text-white flex-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (location.coordinates_lat && location.coordinates_lng) {
                          window.open(`https://maps.google.com/?q=${location.coordinates_lat},${location.coordinates_lng}`, '_blank')
                        }
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-accent text-accent hover:bg-accent hover:text-white flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(`tel:${location.phone}`)
                      }}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-accent/5 to-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" variants={itemVariants}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Us on <span className="text-accent">Map</span></h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              All our locations are strategically placed to serve you better. Click on any location to get detailed directions.
            </p>
          </div>
          
          <div className="bg-background rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="mb-6">
              <Map className="w-16 h-16 text-accent mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Interactive Map</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              For the best experience, please visit us directly or use your preferred map application to navigate to our locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {locations.map((location) => (
                <Button
                  key={location.id}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-white px-6 py-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => {
                      if (location.coordinates_lat && location.coordinates_lng) {
                        window.open(`https://maps.google.com/?q=${location.coordinates_lat},${location.coordinates_lng}`, '_blank')
                      }
                    }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {location.name} on Maps
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-primary text-primary-foreground"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" variants={itemVariants}>
          <h2 className="text-3xl font-bold mb-4">Planning a Visit?</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether it&#39;s a family dinner, business lunch, or special celebration, we&#39;re here to make it memorable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="default"
              onClick={() => window.location.href = '/contact'}
              className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/menu'}
              className="border-white text-white hover:bg-white hover:text-primary shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              View Menu
            </Button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default Locations