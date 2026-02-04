import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import { 
  Code, 
  Database, 
  Brain, 
  Cloud, 
  Shield, 
  Palette, 
  TrendingUp, 
  Globe,
  Loader2,
  ArrowRight,
  BookOpen,
  Cpu,
  Server,
  Lock,
  Brush,
  Megaphone
} from "lucide-react";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  level: string;
  highlights: string[];
}

const Courses = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Development", 
    "Data Science",
    "AI/ML",
    "Cloud",
    "Security",
    "Design",
    "Marketing"
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCourses();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to categorize courses based on title/content
  const getCourseCategory = (course: Course): string => {
    const title = course.title.toLowerCase();
    const description = course.description.toLowerCase();
    
    if (title.includes('python') || title.includes('web') || title.includes('development') || title.includes('programming')) {
      return 'Development';
    }
    if (title.includes('data science') || title.includes('analytics') || title.includes('data')) {
      return 'Data Science';
    }
    if (title.includes('ai') || title.includes('machine learning') || title.includes('artificial intelligence') || title.includes('ml')) {
      return 'AI/ML';
    }
    if (title.includes('cloud') || title.includes('devops') || title.includes('aws') || title.includes('azure')) {
      return 'Cloud';
    }
    if (title.includes('security') || title.includes('cybersecurity') || title.includes('cyber')) {
      return 'Security';
    }
    if (title.includes('ui') || title.includes('ux') || title.includes('design')) {
      return 'Design';
    }
    if (title.includes('marketing') || title.includes('digital marketing') || title.includes('seo')) {
      return 'Marketing';
    }
    return 'Development'; // Default category
  };

  const filteredCourses = selectedCategory === "All" 
    ? courses 
    : courses.filter(course => getCourseCategory(course) === selectedCategory);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6 text-primary animate-fade-in">Top IT & Non-IT Job-Oriented Courses in Chennai</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Gain hands-on experience, work on practical projects, and learn from expert mentors to launch your career in the tech and professional sectors.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gradient-to-b from-muted/30 to-background border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Course Categories</h2>
            <p className="text-muted-foreground">Choose your area of interest</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {categories.map((category, index) => {
              const isActive = selectedCategory === category;
              const courseCount = category === "All" 
                ? courses.length 
                : courses.filter(course => getCourseCategory(course) === category).length;
              
              // Get category icon
              const getCategoryIcon = (cat: string) => {
                switch (cat) {
                  case "All": return <BookOpen className="w-4 h-4" />;
                  case "Development": return <Code className="w-4 h-4" />;
                  case "Data Science": return <Database className="w-4 h-4" />;
                  case "AI/ML": return <Brain className="w-4 h-4" />;
                  case "Cloud": return <Cloud className="w-4 h-4" />;
                  case "Security": return <Shield className="w-4 h-4" />;
                  case "Design": return <Palette className="w-4 h-4" />;
                  case "Marketing": return <TrendingUp className="w-4 h-4" />;
                  default: return <Code className="w-4 h-4" />;
                }
              };
              
              return (
                <Button
                  key={category}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    relative transition-all duration-300 hover:scale-105 animate-fade-in
                    ${isActive 
                      ? "bg-gradient-primary shadow-lg" 
                      : "hover:bg-primary/10 hover:border-primary/50"
                    }
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full 
                      ${isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-primary/10 text-primary"
                      }
                    `}>
                      {courseCount}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Results Counter */}
          {!loading && (
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                {selectedCategory === "All" 
                  ? `Showing all ${filteredCourses.length} courses`
                  : `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} in ${selectedCategory}`
                }
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-4">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-2">No courses found</h3>
                <p className="text-muted-foreground text-lg mb-6">
                  No courses available in the "{selectedCategory}" category yet.
                </p>
                <Button 
                  onClick={() => setSelectedCategory("All")}
                  className="bg-gradient-primary"
                >
                  View All Courses
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <Card 
                  key={course._id} 
                  className="hover-lift border-primary/20 animate-scale-in group overflow-hidden bg-gradient-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="relative">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle 
                      className="text-xl group-hover:text-primary transition-colors duration-300"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.title) }}
                    />
                    <div className="flex gap-2 flex-wrap mt-2">
                      <Badge variant="secondary" className="animate-fade-in">{course.duration}</Badge>
                      <Badge variant="outline" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>{course.level}</Badge>
                      <Badge 
                        variant="default" 
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors animate-fade-in" 
                        style={{ animationDelay: '0.2s' }}
                      >
                        {getCourseCategory(course)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div 
                      className="text-muted-foreground text-justify line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.description) }}
                    />
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Modules:</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.highlights.slice(0, 4).map((highlight, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs hover:bg-primary hover:text-white transition-colors duration-300"
                          >
                            {highlight}
                          </Badge>
                        ))}
                        {course.highlights.length > 4 && (
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
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What You'll Get</h2>
            <p className="text-muted-foreground text-lg">Every course includes</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-semibold mb-2">Comprehensive Materials</h3>
                <p className="text-sm text-muted-foreground">Study guides, code samples, and resources</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="font-semibold mb-2">Live Projects</h3>
                <p className="text-sm text-muted-foreground">Build real-world applications</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-semibold mb-2">Certification</h3>
                <p className="text-sm text-muted-foreground">Industry-recognized certificates</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="font-semibold mb-2">Placement Support</h3>
                <p className="text-sm text-muted-foreground">Job assistance and interview prep</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
