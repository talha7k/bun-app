'use client'

import { useState, useEffect } from 'react'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './ui/carousel'
import { Button } from './ui/button'
import { Maximize2 } from 'lucide-react'

interface MenuItemImage {
  id: number
  filename: string
  original_name: string
  file_size: number
  created_at: string
}

interface MenuItemImageCarouselProps {
  images: MenuItemImage[]
  className?: string
  showImageCount?: boolean
  onImageClick?: (image: MenuItemImage) => void
  compact?: boolean
}

const MenuItemImageCarousel = ({ 
  images, 
  className = '', 
  showImageCount = true,
  onImageClick,
  compact = false
}: MenuItemImageCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    onSelect()

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${compact ? 'h-32 w-32' : 'h-48 w-full'} ${className}`}>
        <span className="text-gray-400 text-sm">No images available</span>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <img 
          src={`/uploads/${images[0]?.filename}`} 
          alt={images[0]?.original_name || 'Menu item image'} 
          loading="lazy"
          className={`${compact ? 'h-32 w-32' : 'h-48 w-full'} object-cover rounded-lg cursor-pointer transition-transform hover:scale-105`}
          onClick={() => images[0] && onImageClick?.(images[0])}
        />
        {onImageClick && images[0] && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              if (images[0]) onImageClick(images[0])
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  // Multiple images - use carousel
  return (
    <div className={`relative ${className}`}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id} className="h-48">
              <div className="relative h-full">
                <img 
                  src={`/uploads/${image.filename}`} 
                  alt={image.original_name} 
                  loading="lazy"
                  className="h-48 w-full object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                  onClick={() => onImageClick?.(image)}
                />
                {onImageClick && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onImageClick(image)
                    }}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious 
          className="bg-black/60 hover:bg-black/80 text-white border-none z-10 backdrop-blur-sm shadow-lg" 
        />
        <CarouselNext 
          className="bg-black/60 hover:bg-black/80 text-white border-none z-10 backdrop-blur-sm shadow-lg" 
        />
      </Carousel>
      
      {showImageCount && (
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
          {currentSlide + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

export default MenuItemImageCarousel