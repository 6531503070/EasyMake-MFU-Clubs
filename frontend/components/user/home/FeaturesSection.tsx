"use client";

import { motion } from "framer-motion";
import { Users, Calendar, Bell, Sparkles, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  { icon: Users, title: "Join Clubs", description: "Discover and join clubs that match your interests" },
  { icon: Calendar, title: "Track Events", description: "Never miss an event with our calendar system" },
  { icon: Bell, title: "Get Notified", description: "Receive updates about your favorite clubs" },
  { icon: Sparkles, title: "AI Recommendations", description: "Get personalized activity suggestions" },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 bg-surface/50 z-10">
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
            Everything you need to engage with campus life in one place. Join clubs, track events, and never miss out on
            opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card className="bg-background border-border hover:border-primary transition-all duration-300 h-full group">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
