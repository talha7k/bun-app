import { useState } from 'react'
import { 
  Dialog,
  DialogContent,
} from './ui/dialog'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './ui/carousel'
import { Button } from './ui/button'
import { Maximize2, Search } from 'lucide-react'

interface ImageItem {
  id: number
  filename: string
  original_name: string
  file_size: number
  created_at: string
}

interface ImageGalleryProps {
  images: ImageItem[]
  title?: string
  description?: string
  className?: string
  showTitle?: boolean
  height?: string
}

export const ImageGallery = ({ 
  images, 
  title = "Gallery",
  description,
  className = "",
  showTitle = true,
  height = "h-96"
}: ImageGalleryProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [api, setApi] = useState<CarouselApi>()

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image)
    setDialogOpen(true)
  }

  const handleThumbnailClick = (image: ImageItem, index: number) => {
    // Navigate to specific slide in carousel first
    if (api) {
      api.scrollTo(index)
    }
    // Update selected image but don't open dialog
    setSelectedImage(image)
  }

  const handleZoomClick = (image: ImageItem) => {
    setSelectedImage(image)
    setDialogOpen(true)
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <section className={`py-16 bg-white ${className}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {showTitle && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
              {description && (
                <p className="text-lg text-gray-600">{description}</p>
              )}
            </div>
          )}
          
          {/* Main Image Carousel */}
          <div className="rounded-2xl overflow-hidden shadow-2xl mb-8">
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
                  <CarouselItem key={image.id} className={height}>
                    <div className="relative h-full">
                      <img 
                        src={`/uploads/${image.filename}`} 
                        alt={image.original_name} 
                        loading="lazy"
                        className={`${height} w-full object-cover cursor-pointer transition-transform hover:scale-105`}
                        onClick={() => handleZoomClick(image)}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-4 right-4 h-10 w-10 p-0 opacity-0 hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white border-none"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleZoomClick(image)
                        }}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
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
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm">
              {currentSlide + 1} / {images.length}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div 
                  key={image.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                    currentSlide === index ? 'ring-2 ring-accent ring-offset-2' : ''
                  }`}
                  onClick={() => handleThumbnailClick(image, index)}
                >
                  <img 
                    src={`/uploads/${image.filename}`} 
                    alt={`${image.original_name} thumbnail`} 
                    loading="lazy"
                    className="h-32 w-full object-cover transition-transform group-hover:scale-110 duration-300"
                  />

                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Zoom Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black/90 border-none">
          {selectedImage && (
            <div className="relative">
              {/* Find current image index */}
              {(() => {
                const currentIndex = images.findIndex(img => img.id === selectedImage.id)
                return (
                  <>
                    <img 
                      src={`/uploads/${selectedImage.filename}`} 
                      alt={selectedImage.original_name} 
                      className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                    />
                    
                    {/* Navigation Controls */}
                    {images.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 p-0 bg-black/60 hover:bg-black/80 text-white border-none backdrop-blur-sm"
                          onClick={() => {
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
                            const prevImage = images[prevIndex]
                            if (prevImage) setSelectedImage(prevImage)
                          }}
                        >
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </Button>
                        
                        {/* Next Button */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 p-0 bg-black/60 hover:bg-black/80 text-white border-none backdrop-blur-sm"
                          onClick={() => {
                            const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
                            const nextImage = images[nextIndex]
                            if (nextImage) setSelectedImage(nextImage)
                          }}
                        >
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Button>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                          {currentIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ImageGallery