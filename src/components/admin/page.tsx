"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

type Course = { id: string; title: string; duration: string; careerOpportunities: string; fee: string; mode: string; isFeatured: boolean };
type Feature = { id: string; title: string; description: string };
type Stat = { id: string; label: string; value: string };
type Testimonial = { id: string; name: string; role: string; quote: string };

export default function AdminPage() {
  const [hero, setHero] = useState({ title: "", subtitle: "", cta: "" });
  const [about, setAbout] = useState({ description: "" });
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseForm, setCourseForm] = useState<Course>({
    id: "",
    title: "",
    duration: "",
    careerOpportunities: "",
    fee: "",
    mode: "Offline",
    isFeatured: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await apiClient.get("/api/landing");
        const data = res.data;
        if (!data) return;

        setHero(data.hero || {});
        setAbout(data.about || {});
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      }
    };
    loadData();
  }, []);

  const saveAll = async () => {
    try {
      await apiClient.post("/api/landing", {
        hero,
        about,
        courses,
      });
      alert("✅ Landing content saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save content");
    }
  };

  const removeItem = (id: string, setter: any) => setter((prev: any[]) => prev.filter(item => item.id !== id));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold">Landing Page Admin Panel</h1>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold text-lg">Hero Section</h2>
          <Input placeholder="Hero Title" value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} />
          <Input placeholder="Subtitle" value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} />
          <Input placeholder="CTA Text" value={hero.cta} onChange={e => setHero({ ...hero, cta: e.target.value })} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg">About Section</h2>
          <Textarea value={about.description} onChange={e => setAbout({ description: e.target.value })} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-xl">Courses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Title" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
            <Input placeholder="Duration" value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} />
            <Input placeholder="Career Opportunities" value={courseForm.careerOpportunities} onChange={e => setCourseForm({ ...courseForm, careerOpportunities: e.target.value })} />
            <Input placeholder="Fee" value={courseForm.fee} onChange={e => setCourseForm({ ...courseForm, fee: e.target.value })} />
            <Input placeholder="Mode" value={courseForm.mode} onChange={e => setCourseForm({ ...courseForm, mode: e.target.value })} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={courseForm.isFeatured} onChange={e => setCourseForm({ ...courseForm, isFeatured: e.target.checked })} />
            Featured
          </label>
          <Button
            onClick={() => {
              setCourses([...courses, { ...courseForm, id: crypto.randomUUID() }]);
              setCourseForm({ id: "", title: "", duration: "", careerOpportunities: "", fee: "", mode: "Offline", isFeatured: false });
            }}
          >
            ➕ Add Course
          </Button>

          {courses.map(c => (
            <div key={c.id} className="border p-4 rounded flex justify-between">
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p>{c.duration} | {c.mode}</p>
                <p>{c.fee}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeItem(c.id, setCourses)}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button size="lg" onClick={saveAll}>💾 Save All</Button>
    </div>
  );
}
