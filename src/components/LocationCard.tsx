import { motion, type Variants } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MenuItemImageCarousel from '@/components/MenuItemImageCarousel'

interface LocationImage {
  id: number
  filename: string
  original_name: string
  file_size: number
  is_primary: boolean
  created_at: string
}

interface Location {
  id: number
  name: string
  address: string
  phone: string
  email: string
  hours: string
  description: string
  features: string[]
  coordinatesLat?: number
  coordinatesLng?: number
  images: LocationImage[]
  created_at: string
  updated_at: string
}

interface LocationCardProps {
  location: Location
  variant?: 'display' | 'admin'
  onEdit?: (location: Location) => void
  onDelete?: (location: Location) => void
  className?: string
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
}

export const LocationCard = ({
  location,
  variant = 'display',
  onEdit,
  onDelete,
  className = ""
}: LocationCardProps) => {
  const isDisplayVariant = variant === 'display'

  return (
    <motion.div
      className={`group relative bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
        isDisplayVariant ? 'hover:scale-105' : 'hover:shadow-md'
      } ${className}`}
      variants={itemVariants}
      whileHover={isDisplayVariant ? { y: -5 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <MenuItemImageCarousel 
          images={location.images || []}
          className="w-full h-full"
          showImageCount={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-xl font-bold transition-colors ${
            isDisplayVariant ? 'text-gray-900 group-hover:text-primary' : 'text-gray-900'
          }`}
          >
            {location.name}
          </h3>
        </div>
        
        <p className="text-gray-600 mb-2 line-clamp-1">
          {location.address}
        </p>

        {/* Contact Info for Admin */}
        {!isDisplayVariant && (
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            {location.phone && (
              <div><strong>Phone:</strong> {location.phone}</div>
            )}
            {location.email && (
              <div><strong>Email:</strong> {location.email}</div>
            )}
            {location.hours && (
              <div><strong>Hours:</strong> {location.hours}</div>
            )}
          </div>
        )}
        
        {/* Features */}
        {location.features && location.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {location.features.slice(0, 3).map((feature, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 text-primary text-xs"
              >
                {feature}
              </Badge>
            ))}
            {location.features.length > 3 && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                +{location.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Description for display variant */}
        {isDisplayVariant && location.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {location.description}
          </p>
        )}

        {/* Admin Actions */}
        {!isDisplayVariant && (onEdit || onDelete) && (
          <div className="flex gap-2 pt-4 border-t">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(location)}
                className="flex-1"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(location)}
                className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default LocationCard