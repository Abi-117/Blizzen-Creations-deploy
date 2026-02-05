"use client";

import { useEffect, useState } from "react";

/* ================= API BASE ================= */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/landing`);
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
