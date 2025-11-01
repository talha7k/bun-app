'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ParticleButton from '@/components/kokonutui/particle-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/sections/HeroSection'
import { CategoryTabs } from '@/components/sections/CategoryTabs'
import { MenuCarousel } from '@/components/sections/MenuCarousel'
import { DietaryInfo } from '@/components/sections/DietaryInfo'
import { CTASection } from '@/components/sections/CTASection'
import MenuItemImageCarousel from '@/components/MenuItemImageCarousel'
import { type MenuItem, type MenuItemImage, type Category } from '@/types/menu'
import { 
  Sprout, 
  Wheat, 
  Milk, 
  AlertCircle,
  Star,
  Phone,
  ArrowRight,
  MapPin
} from 'lucide-react'
import menuHeroImage from '@/assets/hero/menu.jpg'
const menuHeroImageString = menuHeroImage.src

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data)
        if (data.length > 0 && !activeCategory) {
          setActiveCategory(data[0].id)
        }
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  // Fetch menu items when category changes
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    if (activeCategory) {
      if (isMounted) setLoading(true)
      // Get the category name to filter by
      const categoryName = categories.find(cat => cat.id === activeCategory)?.name;
      fetch(`/api/menu-items${categoryName ? `?category=${categoryName}` : ''}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setMenuItems(data)
            setLoading(false)
          }
        })
        .catch(err => {
          console.error('Error fetching menu items:', err)
          if (isMounted) setLoading(false)
        })
    } else {
      // If no active category, load all items
      if (isMounted) setLoading(true)
      fetch('/api/menu-items')
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setMenuItems(data)
            setLoading(false)
          }
        })
        .catch(err => {
          console.error('Error fetching menu items:', err)
          if (isMounted) setLoading(false)
        })
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [activeCategory, categories])

  const dietaryItems = [
    {
      title: "Vegetarian",
      description: "Plant-based options available",
      icon: <Sprout className="w-6 h-6 text-green-600" />
    },
    {
      title: "Gluten-Free",
      description: "Many gluten-free choices",
      icon: <Wheat className="w-6 h-6 text-amber-600" />
    },
    {
      title: "Dairy-Free",
      description: "Dairy alternatives available",
      icon: <Milk className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Allergy-Friendly",
      description: "Allergy information provided",
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />
    }
  ]

return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <HeroSection
        title={
          <div>
            Our Menu
          </div>
        }
        description="Discover culinary creations crafted with passion and finest ingredients"
        backgroundImage={menuHeroImageString}
      />

      {/* Categories */}
      <CategoryTabs
        categories={categories.map(cat => ({ 
          id: cat.id.toString(), 
          name: cat.name, 
          icon: cat.icon 
        }))}
        activeCategory={activeCategory?.toString() || ''}
        onCategoryChange={(categoryId) => setActiveCategory(parseInt(categoryId))}
      />

      {/* Menu Items */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="text-xl text-gray-600">Loading menu items...</div>
        </div>
      ) : (
        <MenuCarousel
          items={menuItems}
          tagComponent={(tag: string, index: number) => (
            <Badge 
              key={index}
              variant="secondary"
              className="bg-accent/10 text-accent hover:bg-accent/20"
            >
              {tag}
            </Badge>
          )}
          popularBadge={
            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              Popular
            </span>
          }
        />
      )}

      {/* Dietary Information */}
      <DietaryInfo
        items={dietaryItems}
        title="Dietary Information"
        subtitle="We accommodate various dietary preferences"
        background="bg-white"
      />

      {/* CTA */}
      <CTASection
        title="Ready to Dine With Us?"
        description="Reserve your table and experience our culinary creations"
        background="bg-primary"
        isDarkBackground={true}
        primaryButton={
          <Link href="/contact">
            <ParticleButton variant="default" size="lg" className="text-lg px-8">
              Make a Reservation
              <Phone className="ml-2 w-5 h-5" />
            </ParticleButton>
          </Link>
        }
        secondaryButton={
          <Link href="/locations">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Find Location
              <MapPin className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        }
      />
    </div>
  )
}

export default Menu