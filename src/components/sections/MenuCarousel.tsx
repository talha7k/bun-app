import { motion, type Variants } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { MenuItemCard } from "@/components/MenuItemCard";
import { type ReactNode } from "react";
import { type MenuItem, type MenuItemImage } from "@/types/menu";

// Extend MenuItem for carousel-specific needs if necessary
// For now, MenuItemCard should handle the image_url internally

interface MenuCarouselProps {
  items: MenuItem[];
  className?: string;
  tagComponent?: (tag: string, index: number) => ReactNode;
  popularBadge?: ReactNode;
  itemsPerSlide?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const MenuCarousel = ({
  items,
  className = "",
  tagComponent,
  popularBadge,
  itemsPerSlide = 3,
}: MenuCarouselProps) => {
  // Group items into slides
  const slides = [];
  for (let i = 0; i < items.length; i += itemsPerSlide) {
    slides.push(items.slice(i, i + itemsPerSlide));
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Carousel className="w-full px-12">
            <CarouselContent>
              {slides.map((slide, slideIndex) => (
                <CarouselItem key={slideIndex}>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 m-4 mb-8 ">
                    {slide.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        variant="display"
                        tagComponent={tagComponent}
                        popularBadge={popularBadge}
                      />
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuCarousel;
