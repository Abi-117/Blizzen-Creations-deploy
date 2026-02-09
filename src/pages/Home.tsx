import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/bg2.jpeg";
import { apiService } from "@/services/api";
import CountUp from "@/components/CountUp";
import { sanitizeHtml } from "@/lib/html-sanitizer";

interface HomeContent {
  _id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: string;
  featuredCourses: string[];
  testimonials: Array<{
    name: string;
    role: string;
    message: string;
    image?: string;
  }>;
  stats: Array<{
    label: string;
    value: string;
  }>;
  callToAction: {
    title: string;
    description: string;
    buttonText: string;
  };
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  duration: string;
  level: string;
  instructor: string;
  image?: string;
  highlights: string[];
}

interface TrustStats {
  studentCount: string;
  studentLabel: string;
  ratingPlatforms: Array<{
    name: string;
    rating: number;
    icon: string;
    color: string;
    isActive: boolean;
  }>;
}

const Home = () => {
  const { toast } = useToast();
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [trustStats, setTrustStats] = useState<TrustStats>({
    studentCount: '1,00,000+',
    studentLabel: 'Students Alumni',
    ratingPlatforms: [
      {
        name: 'Trustpilot',
        rating: 4.8,
        icon: 'trustpilot',
        color: '#00b67a',
        isActive: true
      },
      {
        name: 'Google',
        rating: 4.9,
        icon: 'google',
        color: '#4285F4',
        isActive: true
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  // Continuous circular auto-scroll - one by one
  useEffect(() => {
    if (!homeContent?.testimonials || homeContent.testimonials.length <= 3) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => {
        return (prevIndex + 1) % homeContent.testimonials.length;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [homeContent?.testimonials]);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      // Use optimized API service with caching and parallel requests
      const [homeData, coursesData, trustData] = await Promise.all([
        apiService.getHomeContent(),
        apiService.getCourses(),
        apiService.getTrustStats()
      ]);

      if (homeData.success) {
        setHomeContent(homeData.data);
      }
      if (coursesData.success) {
        // Get first 3 courses as featured
        setFeaturedCourses(coursesData.data.slice(0, 3));
      }
      if (trustData) {
        setTrustStats(trustData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!homeContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Content Not Found</h1>
          <p className="text-muted-foreground">Home page content is not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
  className="py-20 md:py-32 relative overflow-hidden bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${heroImage})`
  }}
>
  <div className="container mx-auto px-4 relative z-10">
    <div className="grid md:grid-cols-1 gap-12 items-center">
      <div
  className="
    space-y-6 animate-slide-right
    text-center md:text-left
    mt-10 sm:mt-14 md:mt-0
  "
>


        {/* HERO TITLE */}
        <h1
          className="
            font-bold text-white leading-tight
            text-[32px] sm:text-[40px] md:text-[55px]
            w-full md:w-8/12
            h-auto md:h-36
            px-2 md:pl-16
          "
          style={{ lineHeight: '1.3' }}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(homeContent.heroTitle),
          }}
        />

        {/* HERO DESCRIPTION */}
        <p
          className="
            font-semibold text-white/90
            text-sm sm:text-base
            w-full md:w-5/12
            h-auto md:h-36
            px-2 md:pl-16
            text-center md:text-justify
          "
          style={{ lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(homeContent.heroDescription),
          }}
        />

        {/* BUTTONS */}
        <div
          className="
            flex flex-col sm:flex-row
            gap-4 pt-6 md:pt-10
            items-center md:items-start
            px-2 md:pl-16
          "
        >
          <Link to="/courses">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-all duration-300"
            >
              Explore Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Link to="/contact">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-gray hover:bg-white hover:text-primary"
            >
              Get Free Demo
            </Button>
          </Link>
        </div>

      </div>
    </div>
  </div>
</section>


      {/* Stats Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {homeContent.stats.map((stat, index) => {
              // Extract number and suffix from value (e.g., "5000+" -> 5000, "+")
              const match = stat.value.match(/^([\d,]+)(.*)$/);
              const number = match ? parseInt(match[1].replace(/,/g, '')) : 0;
              const suffix = match ? match[2] : stat.value;
              
              return (
                <div key={index} className="text-center text-white animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-5xl font-bold mb-2">
                    {number > 0 ? (
                      <CountUp end={number} duration={2500} suffix={suffix} />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="pt-8 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary py-5 text-base font-bold">#1 IT & Non-IT Training & Certification Institute in Anna Nagar, Chennai</p>
            <h2 className="text-4xl font-bold mb-4">Top IT & Non-IT Job-Oriented Courses</h2>
            <p className="text-muted-foreground text-lg">Start your journey with our most popular programs</p>
          </div>
          {featuredCourses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <Card key={course._id} className="hover-lift border-primary/20 animate-scale-in group overflow-hidden bg-gradient-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="relative">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-xl">📚</span>
                    </div>
                    <CardTitle 
                      className="text-xl group-hover:text-primary transition-colors duration-300"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.title) }}
                    />
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="secondary" className="animate-fade-in">{course.duration}</Badge>
                        <Badge variant="outline" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>{course.level}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p 
                      className="text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.shortDescription || course.description) }}
                    />

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Modules:</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.highlights && course.highlights.slice(0, 4).map((highlight, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs hover:bg-primary hover:text-white transition-colors duration-300"
                          >
                            {highlight}
                          </Badge>
                        ))}
                        {course.highlights && course.highlights.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.highlights.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Link to={`/courses/${course.slug}`} className="block">
                      <Button className="w-full bg-gradient-primary hover-glow transition-all duration-300 transform group-hover:scale-105">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading featured courses...</div>
            </div>
          )}
          <div className="text-center mt-12 py-5">
            <Link to="/courses">
              <Button size="lg" className="bg-gradient-primary hover-glow">
                View All Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Trusted by <span className="text-primary">{trustStats.studentCount}</span> {trustStats.studentLabel}
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {trustStats.ratingPlatforms.filter(platform => platform.isActive).map((platform, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover-lift">
                <div className="text-5xl font-bold text-primary mb-2">{platform.rating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground mb-3">Ratings on</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-6 h-6" style={{ color: platform.color }} />
                  </div>
                  <span className="text-xl font-semibold">{platform.name}</span>
                </div>
                {platform.name === 'Google' && (
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Student Testimonials</h2>
            <p className="text-muted-foreground text-lg">Hear from our successful students</p>
          </div>
          
          <div className="relative">
            {/* Continuous Infinite Horizontal Scrolling */}
            <div className="flex gap-6 animate-scroll-testimonials hover:pause-animation">
              {/* First set of testimonials */}
              {homeContent.testimonials.map((testimonial, index) => (
                <div 
                  key={`first-${index}`} 
                  className="flex-shrink-0 w-[350px]"
                >
                  <Card className="h-full group hover:scale-105 hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                      {testimonial.image && (
                        <div className="flex justify-center mb-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                                      ${testimonial.name.charAt(0)}
                                    </div>
                                  `;
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-1 mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p 
                        className="text-muted-foreground text-center mb-4 italic min-h-[100px]"
                        dangerouslySetInnerHTML={{ __html: `"${sanitizeHtml(testimonial.message)}"` }}
                      />
                      <div className="text-center">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {homeContent.testimonials.map((testimonial, index) => (
                <div 
                  key={`second-${index}`} 
                  className="flex-shrink-0 w-[350px]"
                >
                  <Card className="h-full group hover:scale-105 hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                      {testimonial.image && (
                        <div className="flex justify-center mb-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                                      ${testimonial.name.charAt(0)}
                                    </div>
                                  `;
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-1 mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p 
                        className="text-muted-foreground text-center mb-4 italic min-h-[100px]"
                        dangerouslySetInnerHTML={{ __html: `"${sanitizeHtml(testimonial.message)}"` }}
                      />
                      <div className="text-center">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-4xl font-bold text-white mb-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(homeContent.callToAction.title) }}
          />
          <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto">
            {/*{homeContent.callToAction.description}*/}Join thousands of successful students and launch your IT, digital marketing, and software development careers with our industry-recognized training programs. Learn from expert instructors and get hands-on experience for job-oriented courses in Chennai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow">
                {homeContent.callToAction.buttonText}
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-gray hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
