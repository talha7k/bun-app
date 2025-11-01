'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface MenuItem {
  name: string
  description: string
  price: string
  tags?: string[]
  popular?: boolean
  badge?: ReactNode
}

interface MenuGridProps {
  items: MenuItem[]
  className?: string
  tagComponent?: (tag: string, index: number) => ReactNode
  popularBadge?: ReactNode
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export const MenuGrid = ({
  items,
  className = "",
  tagComponent,
  popularBadge
}: MenuGridProps) => {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-8 border-2 transition-all ${
                item.popular ? 'border-accent/30 relative' : 'border-transparent'
              }`}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              {item.popular && popularBadge && (
                <div className="absolute -top-3 right-8">
                  {popularBadge}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.name}</h3>
                  <p className="text-gray-600 mb-4 text-lg">{item.description}</p>
                  {item.tags && tagComponent && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIndex) => tagComponent(tag, tagIndex))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent">{item.price}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default MenuGrid