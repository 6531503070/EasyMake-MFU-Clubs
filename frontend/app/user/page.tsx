"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Calendar, Bell, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Join Clubs",
      titleTh: "เข้าร่วมชมรม",
      description: "Discover and join clubs that match your interests",
      descriptionTh: "ค้นพบและเข้าร่วมชมรมที่ตรงกับความสนใจของคุณ",
    },
    {
      icon: Calendar,
      title: "Track Events",
      titleTh: "ติดตามกิจกรรม",
      description: "Never miss an event with our calendar system",
      descriptionTh: "ไม่พลาดกิจกรรมใดๆ ด้วยระบบปฏิทินของเรา",
    },
    {
      icon: Bell,
      title: "Get Notified",
      titleTh: "รับการแจ้งเตือน",
      description: "Receive updates about your favorite clubs",
      descriptionTh: "รับข้อมูลอัปเดตเกี่ยวกับชมรมที่คุณชื่นชอบ",
    },
    {
      icon: Sparkles,
      title: "AI Recommendations",
      titleTh: "คำแนะนำ AI",
      description: "Get personalized activity suggestions",
      descriptionTh: "รับคำแนะนำกิจกรรมที่เหมาะกับคุณ",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo/Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent rounded-2xl rotate-45 opacity-20 blur-xl" />
                <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary-dark rounded-2xl rotate-45 flex items-center justify-center border-2 border-primary-light shadow-2xl">
                  <span className="text-background font-bold text-2xl md:text-3xl -rotate-45">MFU</span>
                </div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="font-playfair text-5xl md:text-7xl font-bold leading-tight">
                <span className="block text-foreground">Laced of</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-primary">
                  ART
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light">Applied Artificial Technology</p>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Discover your passion, connect with like-minded students, and make the most of your university experience
              at Mae Fah Luang University.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-background font-semibold">
                <Link href="/club">
                  Explore Clubs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <Link href="/activities">View Activities</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Active Clubs</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-3xl md:text-4xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground mt-1">Events/Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Students</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-6 h-10 border-2 border-primary rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stay Connected Section */}
      <section className="py-20 bg-surface/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold">
              Stay <span className="text-primary">Connected</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to engage with campus life in one place. Join clubs, track events, and never miss out
              on opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-background border-border hover:border-primary transition-all duration-300 h-full group">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Clubs Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold">
              Featured <span className="text-primary">Clubs</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore some of our most active and engaging student organizations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Laced of ART",
                category: "Arts & Technology",
                image: "/art-technology-club-banner.jpg",
                members: 156,
              },
              {
                name: "Football Club",
                category: "Sports",
                image: "/university-football-team-stadium.jpg",
                members: 89,
              },
              {
                name: "Dance Crew",
                category: "Performance Arts",
                image: "/dance-performance-stage-lights.jpg",
                members: 67,
              },
            ].map((club, index) => (
              <motion.div
                key={club.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href="/club">
                  <Card className="bg-background border-border hover:border-primary transition-all duration-300 overflow-hidden group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={club.image || "/placeholder.svg"}
                        alt={club.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>
                    <CardContent className="p-6 space-y-2">
                      <div className="text-xs text-primary font-medium">{club.category}</div>
                      <h3 className="font-semibold text-xl">{club.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{club.members} members</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 bg-transparent"
            >
              <Link href="/club">
                View All Clubs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
