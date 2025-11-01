import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { LocationDialog } from './LocationDialog'
import { LocationCard } from './LocationCard'

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
  images: Array<{
    id: number
    filename: string
    original_name: string
    file_size: number
    is_primary: boolean
    created_at: string
  }>
  created_at: string
  updated_at: string
}

interface LocationsManagementProps {
  className?: string
}

export function LocationsManagement({ className = '' }: LocationsManagementProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setLoading(true)
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

  const handleAddLocation = () => {
    setEditingLocation(null)
    setIsDialogOpen(true)
  }

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location)
    setIsDialogOpen(true)
  }

  const handleDeleteLocation = async (location: Location) => {
    if (!confirm(`Are you sure you want to delete "${location.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/locations/${location.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLocations(prev => prev.filter(l => l.id !== location.id))
      } else {
        alert('Failed to delete location')
      }
    } catch (error) {
      console.error('Failed to delete location:', error)
      alert('Failed to delete location')
    }
  }

  const handleLocationSubmit = async (locationData: any) => {
    try {
      
      // Debug logging
      console.log('=== LocationsManagement Submit Debug ===')
      console.log('Location data received:', locationData)
      console.log('Images received:', locationData.images)
      console.log('Images type:', typeof locationData.images)
      console.log('Images length:', locationData.images?.length)
      
      const formData = new FormData()
      formData.append('name', locationData.name)
      formData.append('address', locationData.address)
      formData.append('phone', locationData.phone)
      formData.append('email', locationData.email)
      formData.append('hours', locationData.hours)
      formData.append('description', locationData.description)
      formData.append('features', JSON.stringify(locationData.features))
      formData.append('coordinates_lat', locationData.coordinatesLat?.toString() || '')
      formData.append('coordinates_lng', locationData.coordinatesLng?.toString() || '')

      if (locationData.images) {
        console.log('Adding images to FormData...')
        locationData.images.forEach((image: File, index: number) => {
          console.log(`Adding image ${index}:`, image.name, image.size, 'bytes')
          formData.append('images', image)
        })
      }

      // Add images to delete
      if (locationData.images_to_delete && locationData.images_to_delete.length > 0) {
        formData.append('images_to_delete', JSON.stringify(locationData.images_to_delete))
      }

      console.log('FormData entries before sending:')
      for (const [key, value] of formData.entries()) {
        if (value && typeof value === 'object' && 'name' in value) {
          console.log(`${key}: File(${(value as File).name}, ${(value as File).size} bytes)`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }

      const url = editingLocation 
        ? `/api/locations/${editingLocation.id}` 
        : '/api/locations'
      
      const method = editingLocation ? 'PUT' : 'POST'

      console.log(`Sending ${method} request to: ${url}`)

      const response = await fetch(url, {
        method,
        body: formData
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const responseData = await response.json()
        console.log('Response data:', responseData)
        await fetchLocations()
        setIsDialogOpen(false)
        setEditingLocation(null)
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        alert(`Failed to ${editingLocation ? 'update' : 'create'} location: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to save location:', error)
      alert(`Failed to ${editingLocation ? 'update' : 'create'} location`)
    }
  }

  

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-gray-500">Loading locations...</div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Locations Management</h2>
        <Button onClick={handleAddLocation}>
          Add New Location
        </Button>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 mb-4">No locations found</div>
          <Button onClick={handleAddLocation}>
            Add Your First Location
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              variant="admin"
              onEdit={handleEditLocation}
              onDelete={handleDeleteLocation}
            />
          ))}
        </div>
      )}

      <LocationDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false)
            setEditingLocation(null)
          }
        }}
        onSubmit={handleLocationSubmit}
        location={editingLocation}
      />
    </div>
  )
}