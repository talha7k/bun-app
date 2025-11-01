'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface Testimonial {
  name: string
  text: string
  rating?: number
  avatar?: ReactNode
}

interface TestimonialsGridProps {
  testimonials: Testimonial[]
  title?: string
  subtitle?: string
  background?: string
  className?: string
  columns?: 1 | 2 | 3
  ratingComponent?: (rating: number) => ReactNode
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
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

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const TestimonialsGrid = ({
  testimonials,
  title,
  subtitle,
  background = "bg-gray-50",
  className = "",
  columns = 3,
  ratingComponent
}: TestimonialsGridProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3"
  }

  return (
    <section className={`py-20 ${background} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div 
            className="text-center mb-16"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {title && (
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600">{subtitle}</p>
            )}
          </motion.div>
        )}
        
        <motion.div 
          className={`grid ${gridCols[columns]} gap-8`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {testimonial.rating && ratingComponent && (
                <div className="mb-4">
                  {ratingComponent(testimonial.rating)}
                </div>
              )}
              <p className="text-gray-600 mb-6 italic">&quot;{testimonial.text}&quot;</p>
              <div className="flex items-center">
                {testimonial.avatar && (
                  <div className="mr-3">{testimonial.avatar}</div>
                )}
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsGrid