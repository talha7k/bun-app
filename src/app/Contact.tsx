'use client'

import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import ParticleButton from '@/components/kokonutui/particle-button'
import { Dropzone } from '@/components/kibo-ui/dropzone'
import { HeroSection } from '@/components/sections/HeroSection'
import { 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle,
  Map,
  Car,
  Train,
  Users,
  Facebook,
  Instagram,
  Twitter,
  Bookmark
} from 'lucide-react'
import contactHeroImage from '@/assets/hero/contact.jpg'
const contactHeroImageString = contactHeroImage.src

// Animation variants
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-12 max-w-2xl mx-auto">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Message Sent!</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Thank you for contacting us, {formData.name}! We&#39;ll get back to you within 24 hours.
          </p>
          <ParticleButton 
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Send Another Message
          </ParticleButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <HeroSection
        title={
          <div>
            Contact Us
          </div>
        }
        description="We'd love to hear from you. Whether you have a question, feedback, or special request."
        backgroundImage={contactHeroImageString}
      />

      {/* Contact Info Cards */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-8 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-accent/20"
            >
              <div className="mb-6">
                <MapPin className="w-12 h-12 text-accent mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visit Us</h3>
              <p className="text-gray-600 mb-3 leading-relaxed">
                123 Gourmet Street<br />
                Culinary District, CD 12345
              </p>
              <p className="text-gray-600">
                Tuesday - Sunday: 11:30 AM - 10:00 PM
              </p>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-8 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-accent/20"
            >
              <div className="mb-6">
                <Phone className="w-12 h-12 text-accent mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Call Us</h3>
              <p className="text-gray-600 mb-3 leading-relaxed">
                Main: (555) 123-4567<br />
                Reservations: (555) 123-4568
              </p>
              <p className="text-gray-600">
                Available during business hours
              </p>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-8 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-accent/20"
            >
              <div className="mb-6">
                <Mail className="w-12 h-12 text-accent mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Us</h3>
              <p className="text-gray-600 mb-3 leading-relaxed">
                General: hello@bistrobliss.com<br />
                Events: events@bistrobliss.com
              </p>
              <p className="text-gray-600">
                We respond within 24 hours
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Form & Map */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Send us a <span className="text-accent">Message</span></h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="reservation">Reservation Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="catering">Catering & Events</option>
                    <option value="careers">Careers</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <Dropzone
                    onDrop={(files: File[]) => console.log('Files dropped:', files)}
                    accept={{
                      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                      'application/pdf': ['.pdf']
                    }}
                    maxFiles={3}
                    maxSize={5 * 1024 * 1024} // 5MB
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-600 transition-colors"
                  >
                    <p className="text-gray-600">
                      Drag and drop files here, or click to select files
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Images and PDF files up to 5MB
                    </p>
                  </Dropzone>
                </div>

                <ParticleButton 
                  type="submit"
                  className="w-full py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Send Message
                </ParticleButton>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Find <span className="text-accent">Us</span></h2>
              
              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-96 mb-8 flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <Map className="w-16 h-16 text-accent mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-600">123 Gourmet Street, Culinary District</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5 text-accent" />
                    Parking
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Complimentary valet parking available Thursday-Saturday after 6 PM.
                    Street parking available on surrounding streets.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Train className="w-5 h-5 text-accent" />
                    Public Transit
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Located 2 blocks from Culinary District metro station.
                    Bus lines 15, 22, and 34 stop within walking distance.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Accessibility
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Fully wheelchair accessible with ramp entrance and accessible restrooms.
                    Please let us know if you need any special accommodations.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Social Media */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-accent/5 to-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Follow <span className="text-accent">Us</span></h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Stay connected for daily updates, behind-the-scenes content, and exclusive offers
          </p>
          <div className="flex justify-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-accent transition-colors group">
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 mb-3">
                <Facebook className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm font-medium">Facebook</p>
            </a>
            <a href="#" className="text-gray-600 hover:text-accent transition-colors group">
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 mb-3">
                <Instagram className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm font-medium">Instagram</p>
            </a>
            <a href="#" className="text-gray-600 hover:text-accent transition-colors group">
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 mb-3">
                <Twitter className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm font-medium">Twitter</p>
            </a>
            <a href="#" className="text-gray-600 hover:text-accent transition-colors group">
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 mb-3">
                <Bookmark className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm font-medium">Pinterest</p>
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Contact