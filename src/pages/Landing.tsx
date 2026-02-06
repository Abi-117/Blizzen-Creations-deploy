"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowRight,
  Play,
  Code2,
  Database,
  Globe,
  Target,
  Users,
  Award,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  Headphones,
  Clock,
  Phone,
  Mail,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Sparkles,
  Gift,
  Heart,
  Code,
  Palette,
  Star,
  Quote,
} from "lucide-react";

/* ========= SHADCN UI ========= */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

/* ================= DATA ================= */
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
const quickLinks = [
    { href: "#about", label: "About Us" },
    { href: "#courses", label: "Courses" },
    { href: "#features", label: "Features" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/people/Blizzen-Creations/61569073670590/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/blizzen_creations/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/106675251/admin/dashboard/", label: "LinkedIn" },
    { icon: Youtube, href: "https://www.youtube.com/@blizzencreations", label: "YouTube" },
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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/landing");
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

  /* ================= CAROUSEL AUTO ================= */
  useEffect(() => {
    if (isPaused || !data || data.courses.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.courses.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, data]);

  if (loading)
    return <div className="text-center p-8">Loading landing page...</div>;
  if (!data)
    return (
      <div className="text-center p-8 text-red-600">
        Failed to load landing page
      </div>
    );

  const goToPrevious = () => {
    if (!data) return;
    setCurrentIndex(
      (prev) => (prev - 1 + data.courses.length) % data.courses.length
    );
  };
   const handleApplyNow = (courseName: string) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${courseName} course at Blizzen Creations. Please share more details.`
    );
    window.open(`https://wa.me/91919884264816?text=${message}`, "_blank");
  };
  const goToNext = () => {
    if (!data) return;
    setCurrentIndex((prev) => (prev + 1) % data.courses.length);
  };

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <img
            src="/src/assets/logo.png"
            alt="Hero Image"
            className="h-28 ml-20"
          />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float"
              style={{ animationDelay: "1s" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Code2 className="absolute top-32 left-[15%] w-12 h-12 text-primary/20 animate-float" />
          <Database
            className="absolute top-48 right-[20%] w-10 h-10 text-primary/20 animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <Globe
            className="absolute bottom-32 left-[25%] w-14 h-14 text-primary/20 animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container-custom relative z-10 px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Launch Your IT Career Today
              </span>
            </div>
            <h1
              className="text-4xl md:text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
               Build a High-Paying IT Career with Job-Oriented Professional Courses
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Master in-demand IT skills with real-time projects, expert mentorship & 100% placement assistance.
Join 500+ successful students who transformed their careers with Blizzen Creations.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                asChild
              >
                <a href="#contact">
                  Enroll Now <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 group"
                asChild
              >
                <a
    href="https://wa.me/919884264816?text=Hello%20Blizzen%20Creations%20%F0%9F%91%8B%0A%0AI%E2%80%99m%20interested%20in%20booking%20a%20FREE%20demo%20class.%0APlease%20share%20details%20about%20available%20courses%2C%20timings%2C%20and%20fees.%0AThank%20you!"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Play className="mr-2 w-5 h-5 group-hover:text-primary transition-colors" />
    Book Free Demo
  </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section-padding p-10 bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-primary font-semibold mb-4 uppercase tracking-wider text-base">
                About Us
              </span>
              <h2 className="text-6xl md:text-5xl font-bold">

  Why Choose Blizzen Creations – {" "}
  <span className="text-primary">Best IT Training Institute in Chennai?</span>
</h2>


              <p className="text-base text-muted-foreground mb-6 pt-5 leading-relaxed text-justify">
                {/* {data.about.description} */}
                Blizzen Creations is one of the best IT training institutes in Chennai, offering job-oriented IT & non-IT professional courses with hands-on training and placement support. Our courses are designed as per current industry standards, helping students and working professionals get high-paying IT jobs faster.

We provide real-time project training, mock interviews, resume preparation, career guidance, and placement assistance to ensure job readiness.
              </p>
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary">5+</div>
                  <div className="text-sm text-muted-foreground">
                    Years Experience
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Hiring Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Graduates</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-10 align-center text-center">
          <Button variant="default" className="w-auto text-center" size="lg" asChild>
  <a
    href="https://wa.me/919884264816?text=Hello%20Blizzen%20Creations%20%F0%9F%91%8B%0A%0AI%E2%80%99m%20interested%20in%20booking%20a%20FREE%20demo%20class.%0APlease%20share%20details%20about%20available%20courses%2C%20timings%2C%20and%20fees.%0AThank%20you!"
    target="_blank"
    rel="noopener noreferrer"
  >
    Start Your Learning Journey
    <ArrowRight className="ml-2 w-5 h-5" />
  </a>
</Button>
</div>
        </div>
        
      </section>

      {/* COURSES */}
      {/* COURSES */}
{data.courses.length > 0 && (
  <section id="courses" className="py-20 bg-background">
    <div className="container mx-auto px-4">

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-block text-primary font-semibold mb-4 uppercase tracking-wider text-sm">
          Our Programs
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Launch Your <span className="text-primary">IT Career</span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Industry-oriented courses designed to make you job-ready with real-world skills.
        </p>
      </div>

      {/* Featured Course Slider */}
      <div
        className="relative max-w-5xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation */}
        <button
          onClick={goToPrevious}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border rounded-full shadow flex items-center justify-center"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={goToNext}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border rounded-full shadow flex items-center justify-center"
        >
          <ChevronRight />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {data.courses.map((course) => (
              <div key={course.id} className="min-w-full px-2">
                <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">

                  {/* Header */}
                  <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white p-8">
                    <Badge className="bg-white/20 text-white w-fit mb-3">
                      Most Popular
                    </Badge>
                    <h3 className="text-3xl font-bold mb-2">{course.title}</h3>
                    <p className="text-white/80">
                      Job-oriented training with hands-on projects
                    </p>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="p-8 space-y-8">

                    {/* Meta */}
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

                    {/* Career Opportunities */}
                    {course.careerOpportunities && (
                      <div>
                        <h4 className="font-semibold mb-3">Career Opportunities</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.careerOpportunities
                            .split(",")
                            .map((role, i) => (
                              <Badge key={i} variant="outline">
                                {role.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    <div>
                      <h4 className="font-semibold mb-3">What You'll Get</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          "Real-time projects",
                          "Placement support",
                          "Interview preparation",
                          "Expert mentorship",
                        ].map((item, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <CheckCircle2 className="text-primary w-5 h-5" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  {/* Footer */}
                  <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="text-2xl font-bold">₹25,000</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => handleApplyNow(course.title)}
                    >
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4" />
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
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-[Poppins]">
            Key <span className="text-primary">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            What sets Blizzen Creations apart from other training institutes
          </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.features.map((feature) => (
                <div
                  key={feature.id}
                  className="border p-4 rounded shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="font-light mb-2">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      {/* {data.stats.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center py-16 bg-secondary/10">
          {data.stats.map((stat) => (
            <div key={stat.id} className="border p-6 rounded shadow-sm">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </section>
      )} */}

      {/* TESTIMONIALS */}
   

      {data.testimonials.length > 0 && (
        
        <section className="section-padding py-16">
          <div className="container-custom">
             <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-primary font-semibold mb-4 uppercase tracking-wider text-sm">
            Student Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Success Stories That Inspire
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from our graduates who transformed their careers with us.
          </p>
        </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {data.testimonials.map((t) => (
                <Card className="bg-background border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-8">
                                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                
                <div
                  key={t.id}
                  className="border p-6 rounded shadow-sm hover:shadow-md transition"
                >
                    <div className="flex gap-1">
  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
</div>

                  <p className="font-semibold text-foreground pt-3">"{t.quote}"</p>
                  <p className="text-sm text-muted-foreground pt-3">
                    {t.name} - {t.role}
                  </p>
                </div>
                
                </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      
      )}
        <section className="section-padding p-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center text-primary-foreground">
          {/* Limited Time Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Special Offers Just For You!
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
            Don't miss out on these exclusive opportunities to kickstart your IT career.
          </p>
          <Button variant="secondary" className="w-auto text-center" size="lg" asChild>
  <a
    href="https://wa.me/919884264816?text=Hello%20Blizzen%20Creations%20%F0%9F%91%8B%0A%0AI%E2%80%99m%20interested%20in%20booking%20a%20FREE%20demo%20class.%0APlease%20share%20details%20about%20available%20courses%2C%20timings%2C%20and%20fees.%0AThank%20you!"
    target="_blank"
    rel="noopener noreferrer"
  >
    Join Now
    <ArrowRight className="ml-2 w-5 h-5" />
  </a>
</Button>

          {/* Offer Cards */}
          <div className="grid gap-6 md:gap-8 p-5 max-w-3xl mx-auto">
           

            {/* Free Demo Card */}
            <div className="bg-primary-foreground rounded-2xl p-8 text-foreground text-left group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                Try Before You Join
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Free Demo Class
              </h3>
              <p className="text-muted-foreground mb-6">
                Experience our teaching methodology firsthand. Book a free demo session with our expert trainers.
              </p>
              <Button variant="outline" className="w-full" size="lg" asChild>
  <a
    href="https://wa.me/919884264816?text=Hello%20Blizzen%20Creations%20%F0%9F%91%8B%0A%0AI%E2%80%99m%20interested%20in%20booking%20a%20FREE%20demo%20class.%0APlease%20share%20details%20about%20available%20courses%2C%20timings%2C%20and%20fees.%0AThank%20you!"
    target="_blank"
    rel="noopener noreferrer"
  >
    Book Free Demo
    <ArrowRight className="ml-2 w-5 h-5" />
  </a>
</Button>

            </div>
          </div>
        </div>
      </div>
    </section>

      {/* CONTACT */}
      <section
  id="contact"
  className="section-padding p-10 bg-gradient-to-b from-background to-muted/30"
>
  <div className="container-custom">
    {/* Section Header */}
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

    {/* Contact Cards */}
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
  </div>
</section>
{/* FOOTER 
<footer className="bg-foreground text-background p-5">
  <div className="container-custom section-padding ">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
      
      <div>
        <div className="flex items-center gap-2">
            <a
  href="https://www.blizzencreations.com/"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="/src/assets/logo.png"
    alt="Blizzen Creations Logo"
    className="h-28 ml-20 cursor-pointer"
  />
</a>

         
        </div>

        <p className="text-background/70 mb-6 leading-relaxed">
          Transforming careers through quality IT education. Your success is our priority.
        </p>

        <div className="flex gap-3">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              aria-label={social.label}
              className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      
      <div>
        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
        <ul className="space-y-3">
          {quickLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="text-background/70 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

     
      <div>
        <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
        <ul className="space-y-3 text-background/70">
          <li>Anna Nagar, Chennai</li>
          <li>
            <a
              href="tel:+919876543210"
              className="hover:text-primary transition-colors"
            >
             +91 9884264816
            </a>
          </li>
          <li>
            <a
              href="mailto:hello@reallygreatsite.com"
              className="hover:text-primary transition-colors"
            >
              blizzencreations@gmail.com
            </a>
          </li>
        </ul>
      </div>
    </div>

    
    <div className="border-t border-background/20 pt-2 ">
      
        <p className="text-background/60 text-sm text-center">
          © 2026 Blizzen Creations. All rights reserved.
        </p>
     
    </div>
  </div>
</footer>*/}

      
    </main>
  );
}
