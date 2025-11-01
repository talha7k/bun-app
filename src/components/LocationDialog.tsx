'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Dropzone, DropzoneEmptyState, DropzoneContent } from './kibo-ui/dropzone'
import { processImageFile, formatFileSize } from '../lib/image-compression'
import { UploadIcon } from 'lucide-react'

interface Location {
  id?: number
  name: string
  address: string
  phone: string
  email: string
  hours: string
  description: string
  features: string[]
  coordinatesLat?: number
  coordinatesLng?: number
  images?: Array<{
    id: number
    filename: string
    original_name: string
    file_size: number
    is_primary: boolean
    created_at: string
  }>
}

interface LocationWithImages extends Location {
  images?: Array<{
    id: number
    filename: string
    original_name: string
    file_size: number
    is_primary: boolean
    created_at: string
  }>
}

interface LocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (location: any) => void
  location?: LocationWithImages | null
}

const commonFeatures = [
  'Outdoor Seating',
  'Private Dining',
  'Valet Parking',
  'Live Music',
  'Sea View',
  'Family Section',
  'Kids Play Area',
  'Buffet Available',
  'Drive-Thru',
  'Catering Service',
  'Conference Room',
  'Prayer Room',
  'WiFi Available',
  'Delivery Service',
  'Takeaway Available'
]

export function LocationDialog({ open, onOpenChange, onSubmit, location }: LocationDialogProps) {
  const [formData, setFormData] = useState<Location>({
    name: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    description: '',
    features: [],
    coordinatesLat: undefined,
    coordinatesLng: undefined
  })
  const [images, setImages] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [imageProcessing, setImageProcessing] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  } | null>(null)

  useEffect(() => {
    if (location) {
      setFormData(location)
      setImages([]) // Clear new files
      setImagesToDelete([]) // Clear delete list
      setCompressionInfo(null)
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        hours: '',
        description: '',
        features: [],
        coordinatesLat: undefined,
        coordinatesLng: undefined
      })
      setImages([])
      setImagesToDelete([])
      setCompressionInfo(null)
    }
  }, [location, open])

  const handleImageDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setImageProcessing(true);
    setCompressionInfo(null);
    
    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const processed = await processImageFile(file);
          return processed.file;
        })
      );
      
      setImages(prev => [...prev, ...processedFiles]);
      
      const originalTotalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
      const compressedTotalSize = processedFiles.reduce((sum, file) => sum + file.size, 0);
      const compressionRatio = compressedTotalSize / originalTotalSize;
      
      setCompressionInfo({
        originalSize: originalTotalSize,
        compressedSize: compressedTotalSize,
        compressionRatio
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process images');
    } finally {
      setImageProcessing(false);
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSubmit({ 
      ...formData, 
      images,
      images_to_delete: imagesToDelete 
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{location ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          <DialogDescription>
            {location ? 'Edit the location details for your restaurant.' : 'Add a new location to your restaurant.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+966 XX XXX XXXX"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="location@indianvalley.com"
            />
          </div>

          <div>
            <Label htmlFor="hours">Business Hours</Label>
            <Input
              id="hours"
              value={formData.hours}
              onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
              placeholder="Sat-Thu: 11:00 AM - 11:00 PM, Fri: 1:00 PM - 11:00 PM"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Describe this location..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coordinatesLat">Latitude</Label>
              <Input
                id="coordinatesLat"
                type="number"
                step="any"
                value={formData.coordinatesLat || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  coordinatesLat: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                placeholder="24.7136"
              />
            </div>

            <div>
              <Label htmlFor="coordinatesLng">Longitude</Label>
              <Input
                id="coordinatesLng"
                type="number"
                step="any"
                value={formData.coordinatesLng || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  coordinatesLng: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                placeholder="46.6753"
              />
            </div>
          </div>

          <div>
            <Label>Features</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {commonFeatures.map(feature => (
                <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Location Images</Label>
            
            {/* Show existing images */}
            {location && location.images && location.images.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Current images ({location.images.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {location.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img 
                        src={`/uploads/${image.filename}`} 
                        alt={image.original_name} 
                        loading="lazy"
                        className="h-24 w-full object-cover rounded border"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded flex items-end justify-center pb-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setImagesToDelete(prev => [...prev, image.filename])
                          }}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white shadow-lg"
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="mt-1">
                        <p className="text-xs text-gray-500 truncate">{image.original_name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(image.file_size)}</p>
                      </div>
                      {imagesToDelete.includes(image.filename) && (
                        <div className="absolute inset-0 bg-red-500/30 rounded border-2 border-red-500 flex items-center justify-center">
                          <div className="bg-red-600 text-white text-xs px-2 py-1 rounded">Will be deleted</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show new image previews */}
            {images.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">New images to upload ({images.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={image.name} 
                        loading="lazy"
                        className="h-24 w-full object-cover rounded border"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded flex items-end justify-center pb-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setImages(prev => prev.filter((_, i) => i !== index))
                          }}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white shadow-lg"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="mt-1">
                        <p className="text-xs text-gray-500 truncate">{image.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(image.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {compressionInfo && (
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-green-600">
                      Total compressed size: {formatFileSize(compressionInfo.compressedSize)}
                      {compressionInfo.compressionRatio > 0 && 
                        ` (${Math.round((1 - compressionInfo.compressionRatio) * 100)}% smaller)`
                      }
                    </p>
                    {compressionInfo.compressionRatio > 0 && (
                      <p className="text-gray-500">
                        Original total: {formatFileSize(compressionInfo.originalSize)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <Dropzone
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
              maxFiles={5}
              maxSize={5 * 1024 * 1024} // 5MB
              disabled={imageProcessing}
              onDrop={handleImageDrop}
              className="min-h-[100px]"
            >
              <DropzoneEmptyState>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <UploadIcon size={16} />
                  </div>
                  <p className="my-2 w-full truncate text-wrap font-medium text-sm">
                    Upload location images (up to 5)
                  </p>
                  <p className="w-full truncate text-wrap text-muted-foreground text-xs">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-wrap text-muted-foreground text-xs">
                    Max size: 5MB each • Auto-compressed to ~300KB WebP
                  </p>
                </div>
              </DropzoneEmptyState>
              <DropzoneContent />
            </Dropzone>
            
            {imageProcessing && (
              <p className="text-blue-600 text-xs mt-2">Processing images...</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={imageProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={imageProcessing}>
              {imageProcessing ? 'Processing...' : (location ? 'Update Location' : 'Add Location')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}