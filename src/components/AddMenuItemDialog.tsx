'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from './kibo-ui/dropzone'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { processImageFile, formatFileSize } from '../lib/image-compression'
import { UploadIcon, Plus } from 'lucide-react'
import { type MenuItemWithCategory, type Category } from '../types/menu'

interface AddMenuItemDialogProps {
  categories?: Category[]
  onItemAdded?: () => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  item?: MenuItemWithCategory | null | undefined
  onItemSaved?: () => void
}

const AddMenuItemDialog = ({ 
  categories = [], 
  onItemAdded, 
  trigger, 
  open: controlledOpen,
  onOpenChange,
  item,
  onItemSaved
}: AddMenuItemDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  
  // Initialize form data when item changes or dialog opens
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    popular: false,
    tags: '',
    images: [] as File[],
    images_to_delete: [] as string[]
  })

  // Update form data when item prop changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category_id: item.category_id?.toString() || '',
        popular: item.popular || false,
        tags: item.tags?.join(', ') || '',
        images: [] as File[],
        images_to_delete: [] as string[]
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        popular: false,
        tags: '',
        images: [] as File[],
        images_to_delete: [] as string[]
      })
    }
  }, [item, open])
  
  const [imageProcessing, setImageProcessing] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price)
    formDataToSend.append('categoryId', formData.category_id)
    formDataToSend.append('popular', formData.popular.toString())
    formDataToSend.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(t => t)))
    
    // Add new images
    formData.images.forEach((image) => {
      formDataToSend.append('images', image)
    })

    // Add images to delete
    if (formData.images_to_delete.length > 0) {
      formDataToSend.append('images_to_delete', JSON.stringify(formData.images_to_delete))
    }

    try {
      const isEditing = item !== null && item !== undefined
      const url = isEditing ? `/api/menu-items/${item.id}` : '/api/menu-items'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      })

      if (response.ok) {
        onItemAdded?.()
        onItemSaved?.()
        setOpen(false)
        setFormData({
          name: '',
          description: '',
          price: '',
          category_id: '',
          popular: false,
          tags: '',
          images: [],
          images_to_delete: []
        })
      }
    } catch (error) {
      console.error('Error saving menu item:', error)
      alert(`Failed to ${item ? 'update' : 'add'} menu item`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button className="bg-primary hover:bg-primary/90">
      <Plus className="h-4 w-4 mr-2" />
      Add New Menu Item
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Edit the menu item details. You can add new images or remove existing ones.' : 'Add a new menu item to your restaurant menu. You can upload multiple images.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Item name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Price</label>
              <Input
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="SAR 0.00"
                required
              />
            </div>
          </div>
          
<div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe menu item"
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="Vegetarian, Gluten-Free"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Images</label>
            
            {/* Show existing images */}
            {item && item.images && item.images.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Current images ({item.images.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {item.images.map((image) => (
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
                            setFormData({
                              ...formData,
                              images_to_delete: [...formData.images_to_delete, image.filename]
                            });
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
                      {formData.images_to_delete.includes(image.filename) && (
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
            {formData.images.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">New images to upload ({formData.images.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {formData.images.map((image, index) => (
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
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== index)
                            });
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
              maxFiles={10}
              maxSize={5 * 1024 * 1024} // 5MB
              disabled={imageProcessing}
              onDrop={async (acceptedFiles) => {
              if (acceptedFiles.length === 0) return;
              
              setImageProcessing(true);
              setCompressionInfo(null);
              
              try {
                const processedFiles = [];
                let totalOriginalSize = 0;
                let totalCompressedSize = 0;
                
                for (const file of acceptedFiles) {
                  const processed = await processImageFile(file);
                  processedFiles.push(processed.file);
                  totalOriginalSize += processed.originalSize;
                  totalCompressedSize += processed.compressedSize;
                }
                
                setFormData({
                  ...formData, 
                  images: [...formData.images, ...processedFiles]
                });
                
                setCompressionInfo({
                  originalSize: totalOriginalSize,
                  compressedSize: totalCompressedSize,
                  compressionRatio: totalOriginalSize > 0 ? totalCompressedSize / totalOriginalSize : 0
                });
              } catch (error) {
                alert(error instanceof Error ? error.message : 'Failed to process images');
              } finally {
                setImageProcessing(false);
              }
            }}
              className="min-h-[100px]"
            >
              <DropzoneEmptyState>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <UploadIcon size={16} />
                  </div>
                  <p className="my-2 w-full truncate text-wrap font-medium text-sm">
                    Upload images (up to 10)
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
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="popular"
              checked={formData.popular}
              onChange={(e) => setFormData({...formData, popular: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="popular" className="text-sm font-medium text-gray-700">
              Popular item
            </label>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting || imageProcessing}
            >
              {isSubmitting ? (item ? 'Updating...' : 'Adding...') : (item ? 'Update Item' : 'Add Item')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddMenuItemDialog