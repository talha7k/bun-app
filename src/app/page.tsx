'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Utensils, 
  Leaf, 
  ChefHat, 
  Star, 
  Phone, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Quote
} from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { ContentSection } from '@/components/sections/ContentSection'
import { CTASection } from '@/components/sections/CTASection'
import { HeroSection } from '@/components/sections/HeroSection'
import logo from '../assets/logo.png'
import homeHeroImage from '../assets/hero/home.jpg'
const homeHeroImageString = homeHeroImage.src

const Home = () => {
  const features = [
    {
      title: "Authentic Cuisine",
      description: "Experience traditional flavors with modern twists",
      icon: Utensils,
      color: "text-accent"
    },
    {
      title: "Fresh Ingredients", 
      description: "Locally sourced, organic ingredients daily",
      icon: Leaf,
      color: "text-green-600"
    },
    {
      title: "Expert Chefs",
      description: "Culinary masters crafting memorable dishes",
      icon: ChefHat,
      color: "text-blue-600"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "The best dining experience I've had in years! The attention to detail and flavor combinations were absolutely exceptional.",
      rating: 5,
      role: "Food Critic"
    },
    {
      name: "Mike Chen", 
      text: "Incredible food and impeccable service. The atmosphere is perfect for both casual and special occasions.",
      rating: 5,
      role: "Regular Customer"
    },
    {
      name: "Emma Davis",
      text: "A hidden gem that exceeded all expectations. Every dish tells a story and every visit creates memories.",
      rating: 5,
      role: "Food Blogger"
    }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <HeroSection
        title={
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Welcome to Indian Valley Restaurant
            </h1>
            <p className="text-xl md:text-2xl font-light">
              Restaurant
            </p>
          </div>
        }
        subtitle={
          <div className="flex items-center justify-center space-x-2 text-lg md:text-xl">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span>Experience perfect blend of tradition and innovation</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
        }
        description="Where every dish tells a story and every meal creates memories"
        backgroundImage={homeHeroImageString}
        primaryButton={
          <Link href="/contact">
            <Button 
              variant="default"
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white text-lg px-8"
            >
              Reserve Your Table
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        }
        secondaryButton={
          <Link href="/menu">
            <Button 
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent hover:text-white text-lg px-8"
            >
              Explore Menu
            </Button>
          </Link>
        }
      />

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="py-20 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose <span className="text-accent">Indian Valley</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover what makes our restaurant truly special
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-orange-200 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`p-4 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 ${feature.color} shadow-lg`}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-orange-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Indian Cuisine Heritage */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="py-20 bg-gradient-to-br from-accent/5 to-primary/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Authentic <span className="text-accent">Indian Cuisine</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the rich flavors and traditions of Indian culinary heritage
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Traditional Curries",
                description: "Slow-cooked with aromatic spices and fresh ingredients",
                icon: "🍛"
              },
              {
                title: "Tandoori Specialties",
                description: "Clay oven cooked meats and vegetables with authentic spices",
                icon: "🔥"
              },
              {
                title: "Biryani Varieties",
                description: "Fragrant rice dishes layered with spices and tender meat",
                icon: "🍚"
              },
              {
                title: "Fresh Naan & Breads",
                description: "Handcrafted breads baked in traditional tandoor ovens",
                icon: "🥖"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-orange-200 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Regional Specialties */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="py-20 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Regional <span className="text-accent">Specialties</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Journey through India&#39;s diverse culinary landscape
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                region: "North Indian",
                dishes: "Butter Chicken, Dal Makhani, Paneer Tikka",
                description: "Rich, creamy curries and tandoori specialties",
                spice: "🌶️🌶️"
              },
              {
                region: "South Indian", 
                dishes: "Masala Dosa, Idli, Sambar, Coconut Curry",
                description: "Light, flavorful dishes with rice and lentils",
                spice: "🌶️"
              },
              {
                region: "Coastal Indian",
                dishes: "Fish Curry, Prawn Masala, Coconut Rice",
                description: "Fresh seafood with tropical flavors",
                spice: "🌶️🌶️"
              }
            ].map((region, index) => (
              <motion.div
                key={region.region}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-orange-100 hover:border-orange-300 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-foreground mb-3">{region.region}</h3>
                <div className="mb-4">
                  <span className="text-2xl">Spice Level: {region.spice}</span>
                </div>
                <p className="text-gray-700 mb-4 font-medium">{region.description}</p>
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold mb-2">Popular Dishes:</p>
                  <p>{region.dishes}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* About Preview */}
      <ContentSection
        title="Our Story"
        content={[
          "Founded in 2020, Indian Valley Restaurant brings together passion for culinary arts and love for creating memorable dining experiences. Our journey began with a simple vision: to create a space where food becomes art and every meal tells a story.",
          "Today, we continue to push boundaries, combining traditional techniques with innovative approaches to create dishes that surprise and delight."
        ]}
        image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
        imageAlt="Restaurant Interior"
        ctaButton={
          <Link href="/about">
            <Button variant="default" className="bg-accent hover:bg-accent/90 text-white px-8">
              Learn More About Us
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        }
      />

      {/* Testimonials */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="py-20 bg-gradient-to-br from-accent/5 to-primary/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our <span className="text-accent">Guests Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real experiences from our valued customers
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-orange-200 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <Quote className="w-8 h-8 text-orange-200 mb-4" />
                  <p className="text-gray-700 leading-relaxed mb-6 flex-grow italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <CTASection
        title="Ready for an Unforgettable Dining Experience?"
        description="Join us for a culinary journey that will delight your senses and create lasting memories"
        background="bg-primary"
        isDarkBackground={true}
        primaryButton={
          <Link href="/contact">
            <Button variant="default" size="lg" className="bg-primary text-white hover:bg-primary/90 text-lg px-8">
              Make Reservation
              <Phone className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        }
        secondaryButton={
          <Link href="/locations">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8">
              Find Location
              <MapPin className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        }
      />
    </div>
  )
}

export default Home
