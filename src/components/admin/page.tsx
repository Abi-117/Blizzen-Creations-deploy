"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

/* ================= API BASE ================= */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

/* ================= TYPES ================= */
type Course = {
  id: string;
  title: string;
  duration: string;
  careerOpportunities: string;
  fee: string;
  mode: string;
  isFeatured: boolean;
};

type Feature = { id: string; title: string; description: string };
type Stat = { id: string; label: string; value: string };
type Testimonial = { id: string; name: string; role: string; quote: string };

export default function AdminPage() {
  const [hero, setHero] = useState({ title: "", subtitle: "", cta: "" });
  const [about, setAbout] = useState({ description: "" });
  const [courses, setCourses] = useState<Course[]>([]);
  const [contact, setContact] = useState({ phone: "", email: "", address: "" });

  /* LOAD DATA */
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE_URL}/api/landing`);
      const data = await res.json();
      setHero(data.hero);
      setAbout(data.about);
      setCourses(data.courses);
      setContact(data.contact);
    };
    load();
  }, []);

  /* SAVE */
  const saveAll = async () => {
    await fetch(`${API_BASE_URL}/api/landing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hero, about, courses, contact }),
    });
    alert("Saved successfully");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Landing Admin</h1>

      <Card>
        <CardContent className="p-6 space-y-3">
          <Input
            placeholder="Hero Title"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
          />
          <Input
            placeholder="Subtitle"
            value={hero.subtitle}
            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Textarea
            placeholder="About"
            value={about.description}
            onChange={(e) => setAbout({ description: e.target.value })}
          />
        </CardContent>
      </Card>

      <Button size="lg" onClick={saveAll}>
        Save All Changes
      </Button>
    </div>
  );
}
