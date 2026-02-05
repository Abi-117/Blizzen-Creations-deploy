"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get("/api/landing");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch landing data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Failed to load</div>;

  return (
    <main>
      <section className="p-20 text-center">
        <h1 className="text-4xl font-bold">{data.hero.title}</h1>
        <p className="mt-4">{data.hero.subtitle}</p>
      </section>

      <section className="p-10">
        <p>{data.about.description}</p>
      </section>
    </main>
  );
}
