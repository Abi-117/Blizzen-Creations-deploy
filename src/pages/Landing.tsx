"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Play,
  Target,
  Users,
  Award,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  Star,
  Quote,
} from "lucide-react";

/* ========= SHADCN ========= */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ================= STATIC DATA ================= */

const highlights = [
  { icon: Target, title: "Industry-Focused", description: "Curriculum designed with market needs" },
  { icon: Users, title: "Expert Mentorship", description: "Learn from real IT professionals" },
  { icon: Award, title: "Job-Ready Skills", description: "Hands-on practical training" },
  { icon: Lightbulb, title: "Innovation First", description: "Latest tools & technologies" },
];

const courses = [
  {
    id: "1",
    title: "Full Stack Development",
    duration: "4 Months",
    careerOpportunities: "Frontend Developer, Backend Developer, Full Stack Engineer",
  },
  {
    id: "2",
    title: "UI/UX Design",
    duration: "3 Months",
    careerOpportunities: "UI Designer, UX Designer, Product Designer",
  },
  {
    id: "3",
    title: "Data Analytics",
    duration: "4 Months",
    careerOpportunities: "Data Analyst, Business Analyst",
  },
];

const testimonials = [
  {
    id: "1",
    name: "Arun Kumar",
    role: "Full Stack Developer",
    quote: "Blizzen Creations changed my career completely. Excellent training!",
  },
  {
    id: "2",
    name: "Divya S",
    role: "UI/UX Designer",
    quote: "Hands-on projects & mentor support helped me get placed.",
  },
];

/* ================= COMPONENT ================= */

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const i = setInterval(
      () => setCurrentIndex((p) => (p + 1) % courses.length),
      4000
    );
    return () => clearInterval(i);
  }, [paused]);

  const prev = () =>
    setCurrentIndex((p) => (p - 1 + courses.length) % courses.length);
  const next = () =>
    setCurrentIndex((p) => (p + 1) % courses.length);

  const applyNow = (course: string) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in the ${course} course at Blizzen Creations.`
    );
    window.open(`https://wa.me/919884264816?text=${msg}`, "_blank");
  };

  return (
    <main className="overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="min-h-screen flex items-center justify-center pt-24 text-center">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Build a High-Paying IT Career
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Real-time projects, expert mentorship & placement assistance
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              Enroll Now <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              <Play className="mr-2" /> Book Free Demo
            </Button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 px-4">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Blizzen Creations</span>?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Job-oriented IT training institute in Chennai with placement support,
              real-time projects and career guidance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {highlights.map((h, i) => (
              <div key={i} className="bg-background p-6 rounded-xl border">
                <h.icon className="text-primary mb-3" />
                <h3 className="font-semibold">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="py-20">
        <div
          className="container mx-auto max-w-5xl relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button onClick={prev} className="absolute left-0 top-1/2">
            <ChevronLeft />
          </button>
          <button onClick={next} className="absolute right-0 top-1/2">
            <ChevronRight />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {courses.map((c) => (
                <div key={c.id} className="min-w-full px-4">
                  <Card className="shadow-xl">
                    <CardHeader className="bg-primary text-white">
                      <h3 className="text-2xl font-bold">{c.title}</h3>
                      <p className="text-sm opacity-80">Duration: {c.duration}</p>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                      <div className="flex gap-2 flex-wrap">
                        {c.careerOpportunities.split(",").map((r, i) => (
                          <Badge key={i} variant="outline">
                            {r.trim()}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Real-time projects",
                          "Placement support",
                          "Interview prep",
                          "Expert mentors",
                        ].map((t, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <CheckCircle2 className="text-primary w-4 h-4" />
                            <span className="text-sm">{t}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button onClick={() => applyNow(c.title)}>
                        Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto grid md:grid-cols-2 gap-6 px-4">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-6">
                <Quote className="text-primary mb-2" />
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="italic">"{t.quote}"</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.name} – {t.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </main>
  );
}
