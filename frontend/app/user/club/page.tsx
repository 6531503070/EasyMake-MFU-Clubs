"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Users, Search, Grid3x3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { mockClubs } from "@/lib/mock-data"
import { useState, useMemo, useEffect } from "react"

export default function ClubPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [displayCount, setDisplayCount] = useState(9) // Initially show 9 clubs

  // Filter clubs based on search query and category
  const filteredClubs = useMemo(() => {
    let filtered = mockClubs

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (club) => club.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(query) ||
          club.description.toLowerCase().includes(query) ||
          club.category.toLowerCase().includes(query) ||
          (club.nameEn && club.nameEn.toLowerCase().includes(query)) ||
          (club.nameTh && club.nameTh.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  // Display only a limited number of clubs
  const displayedClubs = useMemo(() => {
    return filteredClubs.slice(0, displayCount)
  }, [filteredClubs, displayCount])

  // Check if there are more clubs to load
  const hasMoreClubs = displayCount < filteredClubs.length

  // Load more clubs handler
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6) // Load 6 more clubs each time
  }

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(9)
  }, [searchQuery, selectedCategory])

  const categories = [
    { name: "All", count: mockClubs.length },
    { name: "Arts", count: mockClubs.filter(c => c.category === "arts").length },
    { name: "Sports", count: mockClubs.filter(c => c.category === "sports").length },
    { name: "Technology", count: mockClubs.filter(c => c.category === "technology").length },
    { name: "Music", count: mockClubs.filter(c => c.category === "music").length },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-16">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/sports-day-university-field.jpg"
            alt="MFU Campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent z-10" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="font-playfair text-5xl md:text-7xl font-bold leading-tight">
              MFU <span className="text-primary">Clubs</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore diverse student organizations and find your community at Mae Fah Luang University
            </p>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl mx-auto pt-4 space-y-4"
            >
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search clubs by name, category, or interest..."
                    className="pl-10 bg-white dark:bg-gray-900 border-border h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* View Toggle */}
                <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 border border-border">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-primary hover:bg-primary-dark text-background" : ""}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-primary hover:bg-primary-dark text-background" : ""}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Button
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className={
                        selectedCategory === category.name
                          ? "bg-primary hover:bg-primary-dark text-background whitespace-nowrap"
                          : "border-border hover:border-primary whitespace-nowrap bg-white dark:bg-gray-900"
                      }
                    >
                      {category.name}
                      <Badge variant="secondary" className="ml-2 bg-background/20 text-inherit border-0">
                        {category.count}
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredClubs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-2xl font-semibold">No clubs found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find any clubs matching your search. Try adjusting your filters or search terms.
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
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "max-w-4xl mx-auto space-y-6"
              }
            >
              {displayedClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={`/user/club/${club.id}`}>
                  <Card
                    className={`bg-surface border-border overflow-hidden hover:border-primary transition-all group cursor-pointer h-full ${
                      viewMode === "list" ? "flex flex-row" : ""
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`relative overflow-hidden ${
                        viewMode === "grid" ? "h-56" : "w-48 h-full min-h-[200px]"
                      }`}
                    >
                      <Image
                        src={club.coverImage || "/placeholder.svg"}
                        alt={club.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                      {/* Category Badge */}
                      <Badge className="absolute top-3 right-3 bg-primary text-background border-0 capitalize">
                        {club.category}
                      </Badge>

                      {/* Logo overlay for featured clubs */}
                      {club.logo && (
                        <div className="absolute bottom-3 left-3 w-16 h-16 rounded-lg overflow-hidden border-2 border-background shadow-lg">
                          <Image
                            src={club.logo || "/placeholder.svg"}
                            alt={`${club.name} logo`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className={`p-5 space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-xl line-clamp-1">{club.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{club.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{club.memberCount} members</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary-dark hover:bg-primary/10"
                        >
                          View Club
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
            </div>
          )}

          {/* Load More */}
          {hasMoreClubs && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center pt-12"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                className="border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                Load More Clubs ({filteredClubs.length - displayCount} remaining)
              </Button>
            </motion.div>
          )}

          {/* Showing count */}
          {displayedClubs.length > 0 && !hasMoreClubs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-12 text-muted-foreground"
            >
              Showing all {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-surface/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold">
              Join the <span className="text-primary">Community</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Active Clubs</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Events/Year</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
