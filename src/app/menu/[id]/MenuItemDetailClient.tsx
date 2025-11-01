'use client'

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { 
  Dialog,
  DialogContent,
} from '../../../components/ui/dialog'
import MenuItemImageCarousel from '../../../components/MenuItemImageCarousel'
import { 
  ArrowLeft, 
  Maximize2, 
  Clock, 
  Tag,
  Star,
  Phone,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface MenuItemImage {
  id: number
  filename: string
  original_name: string
  file_size: number
  created_at: string
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  image_url?: string
  category_id: number
  popular: boolean
  tags?: string[]
  images?: MenuItemImage[]
  category_name?: string
}

interface MenuItemDetailClientProps {
  menuItem: MenuItem;
}

const MenuItemDetailClient = ({ menuItem }: MenuItemDetailClientProps) => {
  const [selectedImage, setSelectedImage] = useState<MenuItemImage | null>(null)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  const handleImageClick = (image: MenuItemImage) => {
    setSelectedImage(image)
    setImageDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/menu">
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 lg:hidden mb-4">
              {menuItem.name}
            </h1>
            
            {/* Main Image Carousel */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <MenuItemImageCarousel 
                images={menuItem.images || []}
                onImageClick={handleImageClick}
                className="w-full"
              />
            </div>
            
            {/* Image Gallery */}
            {menuItem.images && menuItem.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {menuItem.images.map((image, index) => (
                  <div 
                    key={image.id}
                    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    onClick={() => handleImageClick(image)}
                  >
                    <img 
                      src={`/uploads/${image.filename}`} 
                      alt={image.original_name} 
                      className="h-24 w-full object-cover transition-transform group-hover:scale-110 duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-opacity rounded-lg flex items-center justify-center">
                      <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 hidden lg:block mb-4">
                {menuItem.name}
              </h1>
              <p className="text-3xl font-bold text-orange-600 mb-6">
                {menuItem.price}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {menuItem.description}
              </p>
            </div>

            {/* Tags */}
            {menuItem.tags && menuItem.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="h-6 w-6 text-orange-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {menuItem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            {menuItem.category_name && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Category</h3>
                <Badge variant="outline" className="text-sm border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  {menuItem.category_name}
                </Badge>
              </div>
            )}

            {/* Popular Badge */}
            {menuItem.popular && (
              <div className="flex items-center gap-2">
                <Badge className="bg-accent text-accent-foreground border-0 shadow-lg">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Popular Item
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button 
                    size="lg"
                    variant="default"
                    className="bg-accent hover:bg-accent/90 text-white flex-1 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Make Reservation
                    <Phone className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-white flex-1"
                  >
                    Contact Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black/90 border-none">
          {selectedImage && (
            <div className="relative">
              <img 
                src={`/uploads/${selectedImage.filename}`} 
                alt={selectedImage.original_name} 
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-6 left-6 bg-black/80 text-white p-4 rounded-xl backdrop-blur-sm">
                <p className="font-medium text-lg mb-1">{selectedImage.original_name}</p>
                <p className="text-sm opacity-90">
                  Size: {Math.round(selectedImage.file_size / 1024)} KB
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MenuItemDetailClient