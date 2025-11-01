'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface Category {
  id: string
  name: string
  icon?: ReactNode
}

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
  className?: string
  sticky?: boolean
}

const tabVariants = {
  inactive: { scale: 1 },
  active: { scale: 1.05 }
}

export const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = "",
  sticky = true
}: CategoryTabsProps) => {
  return (
    <section className={`py-8 bg-white ${sticky ? 'sticky top-16 z-40' : ''} border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              variants={tabVariants}
              animate={activeCategory === category.id ? 'active' : 'inactive'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryTabs