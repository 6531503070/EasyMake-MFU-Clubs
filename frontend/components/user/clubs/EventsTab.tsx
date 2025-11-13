"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, BadgePercent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublicActivitiesByClub, type ActivityApi } from "@/services/activitiesService";
import { ErrorDialog } from "../ErrorDialog";

type Props = { clubId: string };

export function EventsTab({ clubId }: Props) {
  const [events, setEvents] = useState<ActivityApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [errOpen, setErrOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPublicActivitiesByClub(clubId)
      .then((list) => {
        if (!mounted) return;
        setEvents(list);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(e?.message || "Failed to load events");
        setErrOpen(true);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [clubId]);

  if (loading) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-12 text-center text-muted-foreground">
          Loading events...
        </CardContent>
      </Card>
    );
  }

  if (!events.length) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-12 text-center space-y-4">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Upcoming Events</h3>
            <p className="text-muted-foreground">Follow this club to get notified.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="bg-surface border-border overflow-hidden hover:border-primary transition-all group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={(event.images && event.images[0]) || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <Badge className="absolute top-3 right-3 bg-primary text-background border-0 capitalize">
                  published
                </Badge>
              </div>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      {new Date(event.start_time).toLocaleString()}
                      {event.end_time ? ` - ${new Date(event.end_time).toLocaleString()}` : ""}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <ErrorDialog
        open={errOpen}
        onOpenChange={setErrOpen}
        title="Failed to load events"
        message={err || ""}
        actionText="OK"
      />
    </>
  );
}
