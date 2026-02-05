"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Target,
  Users,
  Award,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ================= API BASE ================= */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

/* ================= STATIC DATA ================= */
const highlights = [
  {
    icon: Target,
    title: "Industry-Focused",
    description: "Curriculum designed with current market demands",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Learn from working IT professionals",
  },
  {
    icon: Award,
    title: "Job-Ready Skills",
    description: "Practical training with real projects",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Stay ahead with latest technologies",
  },
];

/* ================= TYPES ================= */
type Course = {
  id: string;
  title: string;
  duration: string;
  careerOpportunities: string;
};

type Feature = { id: string; title: string; description: string };
type Stat = { id: string; label: string; value: string };
type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

type LandingData = {
  hero: { title: string; subtitle: string; cta: string };
  about: { description: string };
  courses: Course[];
  features: Feature[];
  stats: Stat[];
  testimonials: Testimonial[];
  contact: { phone: string; email: string; address: string };
};

export default function LandingPage() {
  const [data, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/landing`);
        if (!res.ok) throw new Error("API failed");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ================= CAROUSEL ================= */
  useEffect(() => {
    if (!data || data.courses.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % data.courses.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!data) return <div className="p-10 text-center text-red-600">Failed to load</div>;

  const prev = () =>
    setCurrentIndex((p) => (p - 1 + data.courses.length) % data.courses.length);
  const next = () =>
    setCurrentIndex((p) => (p + 1) % data.courses.length);

  return (
    <main>
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center text-center p-10">
        <div>
          <h1 className="text-5xl font-bold mb-6">{data.hero.title}</h1>
          <p className="text-muted-foreground mb-8">{data.hero.subtitle}</p>
          <Button asChild>
            <a href="#contact">
              {data.hero.cta} <ArrowRight className="ml-2" />
            </a>
          </Button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="p-10 bg-muted/30">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Why <span className="text-primary">Blizzen Creations?</span>
            </h2>
            <p>{data.about.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((h, i) => (
              <div key={i} className="border p-4 rounded-lg">
                <h.icon className="text-primary mb-2" />
                <h3 className="font-semibold">{h.title}</h3>
                <p className="text-sm">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      {data.courses.length > 0 && (
        <section className="p-10">
          <div className="max-w-4xl mx-auto relative">
            <button onClick={prev} className="absolute left-0 top-1/2">
              <ChevronLeft />
            </button>
            <button onClick={next} className="absolute right-0 top-1/2">
              <ChevronRight />
            </button>

            <Card>
              <CardHeader>
                <h3 className="text-3xl font-bold">
                  {data.courses[currentIndex].title}
                </h3>
              </CardHeader>
              <CardContent>
                <p>Duration: {data.courses[currentIndex].duration}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {data.courses[currentIndex].careerOpportunities
                    .split(",")
                    .map((c, i) => (
                      <Badge key={i} variant="outline">
                        {c.trim()}
                      </Badge>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Apply Now</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="p-10">
        <div className="grid md:grid-cols-2 gap-6">
          {data.testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-6">
                <Quote className="text-primary mb-2" />
                <p>"{t.quote}"</p>
                <p className="text-sm mt-2">
                  {t.name} – {t.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="p-10 bg-muted/20 text-center">
        <h2 className="text-3xl font-bold mb-4">Contact</h2>
        <p>{data.contact.phone}</p>
        <p>{data.contact.email}</p>
        <p>{data.contact.address}</p>
      </section>
    </main>
  );
}
