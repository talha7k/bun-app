import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/sections/HeroSection'
import { ContentSection } from '@/components/sections/ContentSection'
import { Timeline } from '@/components/sections/Timeline'
import { ValuesGrid } from '@/components/sections/ValuesGrid'
import { TeamGrid } from '@/components/sections/TeamGrid'
import { CTASection } from '@/components/sections/CTASection'
import { 
  Sprout, 
  Palette, 
  Heart,
  ArrowRight,
  Phone
} from 'lucide-react'
import aboutHeroImage from '@/assets/hero/about.jpg'
const aboutHeroImageString = aboutHeroImage.src

const About = () => {
  const team = [
    {
      name: "Chef Marcus Rodriguez",
      role: "Executive Chef",
      bio: "With over 20 years of culinary experience, Chef Marcus brings passion and innovation to every dish.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&h=300&fit=crop"
    },
    {
      name: "Sophia Chen",
      role: "Restaurant Manager", 
      bio: "Sophia ensures every guest has an exceptional dining experience with her attention to detail.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop"
    },
    {
      name: "David Martinez",
      role: "Sommelier",
      bio: "David curates our wine selection, pairing perfect wines with our culinary creations.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
    }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Indian Valley Restaurant Opens",
      description: "We opened our doors with a vision to create exceptional dining experiences."
    },
    {
      year: "2021",
      title: "First Award",
      description: "Received 'Best New Restaurant' award from Culinary Magazine."
    },
    {
      year: "2022",
      title: "Expansion",
      description: "Expanded our seating capacity and added outdoor dining."
    },
    {
      year: "2023",
      title: "Michelin Recognition",
      description: "Honored with a Michelin Bib Gourmand distinction."
    }
  ]

  const values = [
    {
      title: "Sustainability",
      description: "We partner with local farmers and suppliers who share our commitment to sustainable practices.",
      icon: <Sprout className="w-8 h-8 text-green-600" />
    },
    {
      title: "Creativity",
      description: "Our chefs are artists, constantly innovating while respecting culinary traditions.",
      icon: <Palette className="w-8 h-8 text-purple-600" />
    },
    {
      title: "Passion",
      description: "Every dish is crafted with love and dedication to creating memorable experiences.",
      icon: <Heart className="w-8 h-8 text-red-600" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <HeroSection
        title={
          <div>
            About Indian Valley Restaurant
          </div>
        }
        description="From a small dream to a culinary destination, discover the journey of Indian Valley Restaurant"
        backgroundImage={aboutHeroImageString}
      />

      {/* Main Story */}
      <ContentSection
        title="Our Culinary Journey"
        content={[
          "Founded in 2020, Indian Valley Restaurant was born from a simple yet powerful idea: to create a space where food becomes art and every meal tells a story. Our founder, Marcus Rodriguez, dreamed of a restaurant that would combine the warmth of traditional dining with innovative culinary techniques.",
          "What started as a small 40-seat establishment has grown into a beloved dining destination, known for our commitment to excellence, locally sourced ingredients, and unforgettable flavors. Every dish that leaves our kitchen is a testament to our philosophy: honor tradition while embracing innovation.",
          "Today, we continue to push boundaries, creating experiences that delight all senses. From the moment you walk through our doors, you become part of our story – a story of passion, creativity, and the universal language of good food."
        ]}
        image={"/assets/images/restaurant-interior.jpg"}
        imageAlt="Restaurant Interior"
        background="bg-white"
        ctaButton={
          <Link href="/menu">
            <Button variant="default" className="px-8">
              Explore Our Menu
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        }
      />

      {/* Timeline */}
      <Timeline
        items={milestones}
        title="Our Journey"
        subtitle="Milestones that shaped our story"
        background="bg-gradient-to-br from-accent/5 to-background"
      />

      {/* Values */}
      <ValuesGrid
        values={values}
        title="Our Values"
        subtitle="The principles that guide everything we do"
        background="bg-white"
        cardBackground="bg-gradient-to-br from-gray-50 to-white border border-gray-100"
        columns={3}
      />

      {/* Team */}
      <TeamGrid
        team={team}
        title="Meet Our Team"
        subtitle="The talented people behind Indian Valley Restaurant"
        background="bg-gradient-to-br from-gray-50 to-white"
      />

      {/* CTA */}
      <CTASection
        title="Join Our Story"
        description="Experience the passion and creativity that define Indian Valley Restaurant"
        background="bg-primary"
        isDarkBackground={true}
        primaryButton={
          <Link href="/contact">
            <Button variant="default" size="lg" className="text-lg px-8">
              Make a Reservation
              <Phone className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        }
        secondaryButton={
          <Link href="/locations">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Find Location
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        }
      />
    </div>
  )
}

export default About