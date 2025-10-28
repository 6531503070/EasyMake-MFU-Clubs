"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, Heart, MessageCircle, Share2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { mockActivities, mockEvents } from "@/lib/mock-data"
import { useState, useMemo, useEffect } from "react"

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [visibleActivitiesCount, setVisibleActivitiesCount] = useState(5)
  const [visibleEventsCount, setVisibleEventsCount] = useState(4)

  // Filter activities and events based on search query and category
  const filteredActivities = useMemo(() => {
    let filtered = mockActivities

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (activity) => activity.type.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.type.toLowerCase().includes(query) ||
          (activity.clubName && activity.clubName.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const filteredEvents = useMemo(() => {
    let filtered = mockEvents

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (event) => event.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          (event.titleEn && event.titleEn.toLowerCase().includes(query)) ||
          (event.titleTh && event.titleTh.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  // Get visible items
  const visibleActivities = filteredActivities.slice(0, visibleActivitiesCount)
  const visibleEvents = filteredEvents.slice(0, visibleEventsCount)

  // Check if there are more items to load
  const hasMoreItems = 
    visibleActivitiesCount < filteredActivities.length ||
    visibleEventsCount < filteredEvents.length

  // Load more function
  const handleLoadMore = () => {
    setVisibleActivitiesCount(prev => Math.min(prev + 5, filteredActivities.length))
    setVisibleEventsCount(prev => Math.min(prev + 4, filteredEvents.length))
  }

  // Reset pagination when search or category changes
  useEffect(() => {
    setVisibleActivitiesCount(5)
    setVisibleEventsCount(4)
  }, [searchQuery, selectedCategory])

  const categories = ["All", "Sports", "Arts", "Academic", "Cultural", "Social", "Workshop", "Announcement", "Achievement", "Event"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/sports-day-university-field.jpg"
            alt="University Activities"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="font-playfair text-5xl md:text-7xl font-bold leading-tight">
              Find Your <span className="text-primary">Point</span> Today!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover exciting events, join activities, and make unforgettable memories at MFU
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto pt-4 space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search activities, events, clubs..."
                  className="pl-10 bg-white dark:bg-gray-900 border-border h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
                {categories.map((category, index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Button
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-primary hover:bg-primary-dark text-background whitespace-nowrap"
                          : "border-border hover:border-primary whitespace-nowrap bg-white dark:bg-gray-900"
                      }
                    >
                      {category}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Activity Feed */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* No Results State */}
            {filteredActivities.length === 0 && filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-2xl font-semibold">No activities or events found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We couldn't find any activities or events matching your search. Try adjusting your filters or search terms.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All")
                    }}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Social Activity Cards */}
            {visibleActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-surface border-border overflow-hidden hover:border-primary/50 transition-all">
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{activity.clubName || "MFU Clubs"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {activity.type}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h2 className="text-xl font-semibold">{activity.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{activity.description}</p>

                      {/* Image if available */}
                      {activity.image && (
                        <div className="relative h-80 rounded-lg overflow-hidden">
                          <Image
                            src={activity.image || "/placeholder.svg"}
                            alt={activity.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Engagement Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {activity.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {activity.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          {activity.shares}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Upcoming Events Section */}
            {visibleEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="pt-8"
              >
                <h2 className="font-playfair text-3xl font-bold mb-6">
                  Upcoming <span className="text-primary">Events</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/user/club/${event.clubId}`}>
                      <Card className="bg-surface border-border overflow-hidden hover:border-primary transition-all group cursor-pointer h-full">
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
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              <span>
                                {event.registeredCount}
                                {event.capacity && `/${event.capacity}`} registered
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
                </div>
              </motion.div>
            )}

            {/* Load More */}
            {hasMoreItems && (
              <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center pt-8"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                className="border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                Load More Activities
              </Button>
            </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
