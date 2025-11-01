import logo from '../assets/logo_white.png'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Brand */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src={logo.src} 
                alt="Indian Valley Restaurant Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            
            {/* Description */}
            <p className="text-accent-foreground/80 max-w-md">
              Experience fine dining with our carefully crafted menu and warm atmosphere. 
              Where every meal is a celebration.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent-foreground/20 hover:bg-accent-foreground/30 hover:scale-110 rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent-foreground/20 hover:bg-accent-foreground/30 hover:scale-110 rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent-foreground/20 hover:bg-accent-foreground/30 hover:scale-110 rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Middle Column - Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link 
                href="/menu" 
                className="text-accent-foreground/80 hover:text-accent-foreground hover:underline transition-all duration-200"
              >
                Menu
              </Link>
              <Link 
                href="/locations" 
                className="text-accent-foreground/80 hover:text-accent-foreground hover:underline transition-all duration-200"
              >
                Locations
              </Link>
              <a 
                href="/about" 
                className="text-accent-foreground/80 hover:text-accent-foreground hover:underline transition-all duration-200"
              >
                About Us
              </a>
              <a 
                href="/contact" 
                className="text-accent-foreground/80 hover:text-accent-foreground hover:underline transition-all duration-200"
              >
                Contact
              </a>
            </div>
          </div>
          
          {/* Right Column - Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-accent-foreground/60" />
                <span className="text-accent-foreground/80">Multiple Locations</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-accent-foreground/60" />
                <span className="text-accent-foreground/80">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-accent-foreground/60" />
                <span className="text-accent-foreground/80">hello@indianvalley.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-accent-foreground/60" />
                <span className="text-accent-foreground/80">Tue-Sun: 11:30 AM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-accent-foreground/20 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-accent-foreground/60 text-sm">
              <p>&copy; 2024 Indian Valley Restaurant. All rights reserved.</p>
            </div>
            <div className="text-accent-foreground/60 text-sm">
              <p>Made with ❤️ for food lovers</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}