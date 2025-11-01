'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface ContentSectionProps {
  title: string
  content: string[]
  image?: string
  imageAlt?: string
  ctaButton?: ReactNode
  imagePosition?: 'left' | 'right'
  background?: string
  className?: string
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const textVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const imageVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const ContentSection = ({
  title,
  content,
  image,
  imageAlt = "",
  ctaButton,
  imagePosition = 'right',
  background = "bg-white",
  className = ""
}: ContentSectionProps) => {
  const isImageLeft = imagePosition === 'left'
  
  return (
    <section className={`py-20 ${background} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={isImageLeft ? imageVariants : textVariants}
            className={isImageLeft ? "order-2 md:order-1" : "order-1"}
          >
            <h2 className="text-4xl font-bold text-primary mb-6">{title}</h2>
            {content.map((paragraph, index) => (
              <p 
                key={index} 
                className={`text-lg text-gray-600 ${index < content.length - 1 ? 'mb-6' : 'mb-8'}`}
              >
                {paragraph}
              </p>
            ))}
            {ctaButton}
          </motion.div>
          
          {image && (
            <motion.div
              variants={isImageLeft ? textVariants : imageVariants}
              className={`relative ${isImageLeft ? "order-1 md:order-2" : "order-2"}`}
            >
              <img 
                src={image}
                alt={imageAlt}
                className="rounded-xl shadow-2xl w-full"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default ContentSection