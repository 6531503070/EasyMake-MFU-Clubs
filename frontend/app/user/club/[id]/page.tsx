"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Users,
  Calendar,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Bell,
  Share2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { mockClubs, mockEvents } from "@/lib/mock-data"

export default function ClubDetailPage() {
  const params = useParams()
  const clubId = params.id as string

  // Find the club
  const club = mockClubs.find((c) => c.id === clubId) || mockClubs[0]

  // Find events for this club
  const clubEvents = mockEvents.filter((e) => e.clubId === clubId)

  // Mock gallery images
  const galleryImages = [
    "/dance-performance-stage-lights.jpg",
    "/band-performance-concert.jpg",
    "/photography-camera-exhibition.jpg",
    "/art-exhibition-gallery.png",
    "/dance-trophy-celebration.jpg",
    "/sports-day-university-field.jpg",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Cover Image */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden pt-16">
        {/* Cover Image */}
        <div className="absolute inset-0">
          <Image src={club.coverImage || "/placeholder.svg"} alt={club.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        {/* Back Button */}
        <div className="absolute top-20 left-4 z-20">
          <Button asChild variant="ghost" size="sm" className="bg-background/80 backdrop-blur-sm hover:bg-background">
            <Link href="/user/club">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clubs
            </Link>
          </Button>
        </div>

        {/* Club Info */}
        <div className="container mx-auto px-4 relative z-10 h-full flex items-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              {/* Club Logo */}
              {club.logo && (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-background shadow-2xl flex-shrink-0">
                  <Image
                    src={club.logo || "/placeholder.svg"}
                    alt={`${club.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Club Details */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Badge className="bg-primary text-background border-0 capitalize">{club.category}</Badge>
                  <h1 className="font-playfair text-4xl md:text-6xl font-bold">{club.name}</h1>
                  <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{club.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium">{club.memberCount} members</span>
                  </div>
                  {club.contactEmail && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-5 h-5 text-primary" />
                      <span>{club.contactEmail}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button size="lg" className="bg-primary hover:bg-primary-dark text-background">
                    <Bell className="w-5 h-5 mr-2" />
                    Follow Club
                  </Button>
                  <Button size="lg" variant="outline" className="border-border hover:border-primary bg-transparent">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                  {club.contactEmail && (
                    <Button size="lg" variant="outline" className="border-border hover:border-primary bg-transparent">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="about" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 bg-surface border border-border">
              <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                About
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-primary data-[state=active]:text-background"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="data-[state=active]:bg-primary data-[state=active]:text-background"
              >
                Gallery
              </TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="mt-8 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-surface border-border">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <h2 className="font-playfair text-3xl font-bold">About {club.name}</h2>
                      <p className="text-muted-foreground leading-relaxed text-lg">{club.description}</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Join us to explore your interests, develop new skills, and connect with fellow students who
                        share your passion. We organize regular meetings, workshops, and events throughout the academic
                        year.
                      </p>
                    </div>

                    {/* Social Links */}
                    {club.socialLinks && (
                      <div className="pt-6 border-t border-border">
                        <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                        <div className="flex gap-3">
                          {club.socialLinks.facebook && (
                            <Button
                              asChild
                              variant="outline"
                              size="icon"
                              className="border-border hover:border-primary hover:bg-primary/10 bg-transparent"
                            >
                              <a href={club.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                <Facebook className="w-5 h-5" />
                              </a>
                            </Button>
                          )}
                          {club.socialLinks.instagram && (
                            <Button
                              asChild
                              variant="outline"
                              size="icon"
                              className="border-border hover:border-primary hover:bg-primary/10 bg-transparent"
                            >
                              <a href={club.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-5 h-5" />
                              </a>
                            </Button>
                          )}
                          {club.socialLinks.twitter && (
                            <Button
                              asChild
                              variant="outline"
                              size="icon"
                              className="border-border hover:border-primary hover:bg-primary/10 bg-transparent"
                            >
                              <a href={club.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                <Twitter className="w-5 h-5" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Info */}
                    <div className="pt-6 border-t border-border">
                      <h3 className="font-semibold text-lg mb-4">Quick Info</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Category</div>
                          <div className="font-medium capitalize">{club.category}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Members</div>
                          <div className="font-medium">{club.memberCount} active members</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Founded</div>
                          <div className="font-medium">
                            {new Date(club.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        {club.contactEmail && (
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Contact</div>
                            <div className="font-medium">{club.contactEmail}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {clubEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {clubEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="bg-surface border-border overflow-hidden hover:border-primary transition-all group h-full">
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={event.coverImage || "/placeholder.svg"}
                              alt={event.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                            <Badge className="absolute top-3 right-3 bg-primary text-background border-0">
                              {event.category}
                            </Badge>
                          </div>
                          <CardContent className="p-5 space-y-3">
                            <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {event.description}
                            </p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>
                                  {new Date(event.date).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}{" "}
                                  at {event.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{event.location}</span>
                              </div>
                              {/* <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                <span>
                                  {event.registeredCount}
                                  {event.capacity && `/${event.capacity}`} registered
                                </span>
                              </div> */}
                            </div>
                            {/* <Button className="w-full bg-primary hover:bg-primary-dark text-background mt-4">
                              Register Now
                            </Button> */}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-surface border-border">
                    <CardContent className="p-12 text-center space-y-4">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-xl">No Upcoming Events</h3>
                        <p className="text-muted-foreground">
                          This club doesn't have any scheduled events at the moment. Follow the club to get notified
                          when new events are announced.
                        </p>
                      </div>
                      <Button className="bg-primary hover:bg-primary-dark text-background">
                        <Bell className="w-4 h-4 mr-2" />
                        Follow Club
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
