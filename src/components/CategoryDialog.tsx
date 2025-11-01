import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

interface Category {
  id: number
  name: string
  icon?: string
}

interface CategoryDialogProps {
  category?: Category | null
  onCategorySaved?: () => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const CategoryDialog = ({ 
  category, 
  onCategorySaved, 
  trigger, 
  open: controlledOpen,
  onOpenChange
}: CategoryDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [formData, setFormData] = useState({
    name: '',
    icon: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when category prop changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        icon: category.icon || ''
      })
    } else {
      setFormData({
        name: '',
        icon: ''
      })
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const url = category ? `/api/categories/${category.id}` : '/api/categories'
      const method = category ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

if (response.ok) {
        onCategorySaved?.()
        setOpen(false)
        if (!category) {
          setFormData({ name: '', icon: '' })
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button className="bg-accent hover:bg-accent/90">
      Add New Category
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogDescription>
            {category 
              ? 'Make changes to the category here. Click save when you\'re done.'
              : 'Add a new category to organize your menu items.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Category Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Appetizers, Main Courses"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Icon (optional)
            </label>
            <Input
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              placeholder="e.g., 🥗, 🍽️, 🍰"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use emojis or text to represent the category
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="bg-accent hover:bg-accent/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (category ? 'Update' : 'Add')} Category
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryDialog