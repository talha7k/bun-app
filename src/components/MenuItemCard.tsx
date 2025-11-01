import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MenuItemImageCarousel from '@/components/MenuItemImageCarousel'
import { type ReactNode } from 'react'
import { type MenuItem, type MenuItemImage } from '../types/menu'

interface MenuItemCardProps {
  item: MenuItem
  variant?: 'display' | 'admin'
  tagComponent?: (tag: string, index: number) => ReactNode
  popularBadge?: ReactNode
  onEdit?: (item: MenuItem) => void
  onDelete?: (id: number) => void
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

export const MenuItemCard = ({
  item,
  variant = 'display',
  tagComponent,
  popularBadge,
  onEdit,
  onDelete,
  className = ""
}: MenuItemCardProps) => {
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
      {item.popular && popularBadge && (
        <div className="absolute top-4 right-4 z-10">
          {popularBadge}
        </div>
      )}
      
{/* Image */}
      <div className="relative h-48 overflow-hidden">
        <MenuItemImageCarousel 
          images={item.images || []}
          className="w-full h-full"
          showImageCount={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div 
        className={`p-6 ${isDisplayVariant ? 'cursor-pointer' : ''}`}
        onClick={() => isDisplayVariant && (window.location.href = `/menu/${item.id}`)}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-xl font-bold transition-colors ${
            isDisplayVariant ? 'text-gray-900 group-hover:text-primary' : 'text-gray-900'
          }`}
          >
            {item.name}
          </h3>
          <div className="text-2xl font-bold text-primary">
            {item.price}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {item.description}
        </p>
        
        {item.tags && tagComponent && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag, tagIndex) => tagComponent(tag, tagIndex))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                +{item.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Admin Actions */}
        {!isDisplayVariant && (onEdit || onDelete) && (
          <div className="flex gap-2 pt-4 border-t">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(item)}
                className="flex-1"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(item.id)}
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

export default MenuItemCard