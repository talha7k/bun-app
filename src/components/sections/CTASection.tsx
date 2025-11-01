'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface CTASectionProps {
  title: string
  description?: string
  primaryButton?: ReactNode
  secondaryButton?: ReactNode
  background?: string
  backgroundImage?: string
  className?: string
  maxWidth?: string
  isDarkBackground?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export const CTASection = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  background = "bg-accent",
  backgroundImage,
  className = "",
  maxWidth = "max-w-4xl",
  isDarkBackground = false
}: CTASectionProps) => {
  const hasImageBackground = !!backgroundImage;
  const shouldUseLightText = hasImageBackground || isDarkBackground;
  
  return (
    <section className={`py-20 relative ${background} ${className}`}>
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
        className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 
          className={`text-4xl font-bold ${shouldUseLightText ? 'text-white' : 'text-accent-foreground'} mb-6`}
          variants={itemVariants}
        >
          {title}
        </motion.h2>
        
        {description && (
          <motion.p 
            className={`text-xl ${shouldUseLightText ? 'text-white/80' : 'text-accent-foreground/80'} mb-8`}
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}
        
        {(primaryButton || secondaryButton) && (
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            {primaryButton}
            {secondaryButton}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default CTASection