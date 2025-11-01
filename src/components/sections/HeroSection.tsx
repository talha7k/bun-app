'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface HeroSectionProps {
  title: ReactNode
  subtitle?: ReactNode
  description?: string
  primaryButton?: ReactNode
  secondaryButton?: ReactNode
  background?: string
  backgroundImage?: string
  className?: string
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const HeroSection = ({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  background = "bg-gradient-to-br from-accent/10 to-white",
  backgroundImage,
  className = ""
}: HeroSectionProps) => {
  return (
    <div className={`relative ${background} py-20 lg:py-32 ${className}`}>
      {backgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {/* Dark overlay to ensure text readability on images */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </>
      )}
      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <motion.h1 
            className={`text-5xl lg:text-7xl font-bold mb-6 ${backgroundImage ? 'text-white' : 'text-foreground'}`}
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.div 
              className={`text-2xl lg:text-3xl mb-8 h-8 ${backgroundImage ? 'text-white/80' : 'text-accent-foreground'}`}
              variants={itemVariants}
            >
              {subtitle}
            </motion.div>
          )}
          
          {description && (
            <motion.p 
              className={`text-xl mb-12 max-w-3xl mx-auto ${backgroundImage ? 'text-white/70' : 'text-muted-foreground'}`}
              variants={itemVariants}
            >
              {description}
            </motion.p>
          )}
          
          {(primaryButton || secondaryButton) && (
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              {primaryButton}
              {secondaryButton}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default HeroSection