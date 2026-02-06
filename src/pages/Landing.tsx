"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Play, Users, TrendingUp, Clock, CheckCircle2, Star, Quote, Database, Globe, Code2, Lightbulb, Target, Award, Sparkles } from "lucide-react";

/* ================= DATA ================= */
const highlights = [
  { icon: Target, title: "Industry-Focused", description: "Curriculum designed with current market demands" },
  { icon: Users, title: "Expert Mentorship", description: "Learn from working IT professionals" },
  { icon: Award, title: "Job-Ready Skills", description: "Practical training with real projects" },
  { icon: Lightbulb, title: "Innovation First", description: "Stay ahead with latest technologies" },
];

const quickLinks = [
  { href: "#about", label: "About Us" },
  { href: "#courses", label: "Courses" },
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  { icon: Play, href: "https://www.facebook.com/people/Blizzen-Creations/61569073670590/", label: "Facebook" },
  { icon: Play, href: "https://www.instagram.com/blizzen_creations/", label: "Instagram" },
  { icon: Play, href: "https://www.linkedin.com/company/106675251/admin/dashboard/", label: "LinkedIn" },
  { icon: Play, href: "https://www.youtube.com/@blizzencreations", label: "YouTube" },
];

/* ================= TYPES ================= */
type Course = { id: string; title: string; duration: string; careerOpportunities: string };
type Feature = { id: string; title: string; description: string };
type Stat = { id: string; label: string; value: string };
type Testimonial = { id: string; name: string; role: string; quote: string };

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
  const [isPaused, setIsPaused] = useState(false);

  /* ================= DYNAMIC BASE URL ================= */
  const BASE_URL =
    process.env.VITE_API_URL || // for Vercel/Render env variable
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-backend-url.com"); // replace with your deployed backend URL

  /* ================= FETCH LANDING DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/landing`);
        if (!res.ok) throw new Error("Failed to fetch landing data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [BASE_URL]);

  /* ================= CAROUSEL AUTO ================= */
  useEffect(() => {
    if (isPaused || !data || data.courses.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.courses.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, data]);

  if (loading) return <div className="text-center p-8">Loading landing page...</div>;
  if (!data) return <div className="text-center p-8 text-red-600">Failed to load landing page</div>;

  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + data.courses.length) % data.courses.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % data.courses.length);

  const handleApplyNow = (courseName: string) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${courseName} course at Blizzen Creations. Please share more details.`
    );
    window.open(`https://wa.me/91919884264816?text=${message}`, "_blank");
  };

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <img src="/src/assets/logo.png" alt="Hero Image" className="h-28 ml-20" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="container-custom relative z-10 px-4 text-center">
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight">{data.hero.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{data.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="px-8 py-6" asChild>
              <a href="#contact">
                Enroll Now <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6" asChild>
              <a href="https://wa.me/919884264816" target="_blank" rel="noopener noreferrer">
                <Play className="mr-2 w-5 h-5" /> Book Free Demo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section-padding p-10 bg-secondary/30">
        <div className="container-custom grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-6xl md:text-5xl font-bold mb-6">
              Why Choose Blizzen Creations – <span className="text-primary">Best IT Training Institute in Chennai?</span>
            </h2>
            <p className="text-base text-muted-foreground mb-6 pt-5 leading-relaxed text-justify">{data.about.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {highlights.map((item, i) => (
              <div key={i} className="bg-background p-6 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      {data.courses.length > 0 && (
        <section id="courses" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-primary font-semibold mb-4 uppercase tracking-wider text-sm">Our Programs</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Launch Your <span className="text-primary">IT Career</span></h2>
            </div>

            <div className="relative max-w-5xl mx-auto" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
              <button onClick={goToPrevious} className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border rounded-full shadow flex items-center justify-center">←</button>
              <button onClick={goToNext} className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border rounded-full shadow flex items-center justify-center">→</button>

              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                  {data.courses.map((course) => (
                    <div key={course.id} className="min-w-full px-2">
                      <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white p-8">
                          <Badge className="bg-white/20 text-white w-fit mb-3">Most Popular</Badge>
                          <h3 className="text-3xl font-bold mb-2">{course.title}</h3>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b pb-6">
                            <div className="flex gap-2 items-center">
                              <Clock className="text-primary" />
                              <div>
                                <p className="font-semibold">{course.duration}</p>
                                <p className="text-xs text-muted-foreground">Duration</p>
                              </div>
                            </div>
                            <div className="flex gap-2 items-center">
                              <Users className="text-primary" />
                              <div>
                                <p className="font-semibold">150+</p>
                                <p className="text-xs text-muted-foreground">Students</p>
                              </div>
                            </div>
                            <div className="flex gap-2 items-center">
                              <TrendingUp className="text-primary" />
                              <div>
                                <p className="font-semibold">₹4–12 LPA</p>
                                <p className="text-xs text-muted-foreground">Salary</p>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold">Online / Offline</p>
                              <p className="text-xs text-muted-foreground">Mode</p>
                            </div>
                          </div>

                          {course.careerOpportunities && (
                            <div>
                              <h4 className="font-semibold mb-3">Career Opportunities</h4>
                              <div className="flex flex-wrap gap-2">
                                {course.careerOpportunities.split(",").map((role, i) => (
                                  <Badge key={i} variant="outline">{role.trim()}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold mb-3">What You'll Get</h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {["Real-time projects", "Placement support", "Interview preparation", "Expert mentorship"].map((item, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                  <CheckCircle2 className="text-primary w-5 h-5" />
                                  <span className="text-muted-foreground">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Starting from</p>
                            <p className="text-2xl font-bold">₹25,000</p>
                          </div>
                          <Button size="lg" onClick={() => handleApplyNow(course.title)}>
                            Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      {data.features.length > 0 && (
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
            {data.features.map((feature) => (
              <div key={feature.id} className="border p-4 rounded shadow-sm hover:shadow-md transition">
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="section-padding p-10 bg-gradient-to-b from-background to-muted/30">
      <div className="text-center max-w-4xl mx-auto mb-16">
      <span className="inline-block text-primary font-semibold mb-4 uppercase tracking-wider text-sm">
        Get In Touch
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Start Your IT Career Journey Today
      </h2>
      <p className="text-lg text-muted-foreground">
        Have questions? We'd love to hear from you. Send us a message and we'll
        respond within 24 hours.
      </p>
    </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {/* Phone */}
      {data.contact.phone && (
        <div className="group bg-background rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition">
            📞
          </div>
          <h3 className="text-lg font-semibold mb-1">Call Us</h3>
          <p className="text-muted-foreground">{data.contact.phone}</p>
        </div>
      )}

      {/* Email */}
      {data.contact.email && (
        <div className="group bg-background rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition">
            ✉️
          </div>
          <h3 className="text-lg font-semibold mb-1">Email Us</h3>
          <p className="text-muted-foreground break-all">
            {data.contact.email}
          </p>
        </div>
      )}

      {/* Address */}
      {data.contact.address && (
        <div className="group bg-background rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition">
            📍
          </div>
          <h3 className="text-lg font-semibold mb-1">Visit Us</h3>
          <p className="text-muted-foreground">{data.contact.address}</p>
        </div>
      )}
    </div>
      </section>
    </main>
  );
}
