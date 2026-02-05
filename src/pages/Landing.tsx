"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */
type Course = { id: string; title: string; duration: string; careerOpportunities: string };
type LandingData = {
  hero: { title: string; subtitle: string; cta: string };
  about: { description: string };
  courses: Course[];
  features?: any[];
  stats?: any[];
  testimonials?: any[];
  contact?: { phone: string; email: string; address: string };
};

/* ================= API FETCH ================= */
// Uses same apiFetch as AdminPage
import { apiFetch } from "@/lib/apiClient"; 

/* ================= COMPONENT ================= */
export default function LandingPage() {
  const [data, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const json = await apiFetch("/landing"); // production-ready apiFetch
        setData(json);
      } catch (err) {
        console.error("Failed to fetch landing data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  /* ================= CAROUSEL ================= */
  useEffect(() => {
    if (isPaused || !data || data.courses.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.courses.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, data]);

  const goToPrevious = () => {
    if (!data) return;
    setCurrentIndex((prev) => (prev - 1 + data.courses.length) % data.courses.length);
  };

  const goToNext = () => {
    if (!data) return;
    setCurrentIndex((prev) => (prev + 1) % data.courses.length);
  };

  const handleApplyNow = (courseName: string) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${courseName} course at Blizzen Creations. Please share more details.`
    );
    window.open(`https://wa.me/91919884264816?text=${message}`, "_blank");
  };

  if (loading) return <div className="text-center p-8">Loading landing page...</div>;
  if (!data) return <div className="text-center p-8 text-red-600">Failed to load landing page</div>;

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="container-custom relative z-10 px-4 text-center">
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight">{data.hero.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{data.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" asChild>
              <a href="#contact">Enroll Now <ArrowRight className="ml-2 w-5 h-5" /></a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 group" asChild>
              <a
                href="https://wa.me/919884264816?text=Hello%20Blizzen%20Creations%20I'm%20interested%20in%20booking%20a%20FREE%20demo%20class."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="mr-2 w-5 h-5 group-hover:text-primary transition-colors" />
                Book Free Demo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* COURSES */}
      {data.courses.length > 0 && (
        <section id="courses" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Launch Your <span className="text-primary">IT Career</span>
              </h2>
            </div>

            <div className="relative max-w-5xl mx-auto" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
              <button onClick={goToPrevious} className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border rounded-full shadow flex items-center justify-center">
                <ChevronLeft />
              </button>
              <button onClick={goToNext} className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border rounded-full shadow flex items-center justify-center">
                <ChevronRight />
              </button>

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
                            <div className="flex gap-2 items-center"><Clock className="text-primary" /><div><p className="font-semibold">{course.duration}</p><p className="text-xs text-muted-foreground">Duration</p></div></div>
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
                        </CardContent>
                        <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between gap-4">
                          <Button size="lg" onClick={() => handleApplyNow(course.title)}>Apply Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
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
    </main>
  );
}
