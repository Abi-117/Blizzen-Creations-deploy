"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiClient";

/* ================= TYPES ================= */
type Course = {
  id: string;
  title: string;
  duration: string;
  careerOpportunities: string;
};

type LandingData = {
  hero: { title: string; subtitle: string; cta: string };
  about: { description: string };
  courses: Course[];
};

/* ================= COMPONENT ================= */
export default function LandingPage() {
  const [data, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const response = await apiFetch("/api/landing"); // ✅ FIX
        setData(response);
      } catch (err) {
        console.error("Landing fetch error:", err);
        setError("Unable to load landing page data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  /* ================= CAROUSEL ================= */
  useEffect(() => {
    if (isPaused || !data?.courses?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.courses.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, data]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <main>
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center text-center pt-20">
        <div>
          <h1 className="text-5xl font-bold mb-4">{data.hero.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {data.hero.subtitle}
          </p>
          <Button size="lg">
            {data.hero.cta}
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* COURSES */}
      {data.courses.length > 0 && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto relative">
            <button onClick={() =>
              setCurrentIndex((currentIndex - 1 + data.courses.length) % data.courses.length)
            }>
              <ChevronLeft />
            </button>

            <button onClick={() =>
              setCurrentIndex((currentIndex + 1) % data.courses.length)
            }>
              <ChevronRight />
            </button>

            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold">
                  {data.courses[currentIndex].title}
                </h3>
              </CardHeader>
              <CardContent>
                <Clock className="inline mr-2" />
                {data.courses[currentIndex].duration}
              </CardContent>
              <CardFooter>
                <Button>
                  Apply Now <ArrowRight className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      )}
    </main>
  );
}
