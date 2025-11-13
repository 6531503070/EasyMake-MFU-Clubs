"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Brand */}
          <div>
            <h3 className="font-semibold text-lg text-primary">MFU Clubs</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2">
              Discover and join student clubs and activities at Mae Fah Luang University.
              Stay connected with campus life.
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 w-full max-w-sm">
            <p className="text-sm text-muted-foreground">
              Subscribe for updates on new events and activities.
            </p>
            <div className="flex gap-2 justify-center">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-background border-border"
              />
              <Button size="icon" variant="default">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Mae Fah Luang University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
