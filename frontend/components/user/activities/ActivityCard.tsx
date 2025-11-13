"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActivityFeedItem } from "@/services/activitiesService";

type Props = {
  event: ActivityFeedItem;
};

export function ActivityCard({ event }: Props) {
  return (
    <Link href={`/user/club/${event.club_id}`}>
      <Card className="bg-surface border-border overflow-hidden hover:border-primary transition-all group cursor-pointer h-full">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.images?.[0] || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <Badge className="absolute top-3 right-3 bg-primary text-background border-0">
            {event.club_name || "MFU Club"}
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
                {new Date(event.start_time).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>
                {event.registered ?? 0}
                {event.capacity && `/${event.capacity}`} registered
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
