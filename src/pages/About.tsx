import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { Target, Eye, Heart, Award, Loader2 } from "lucide-react";
import { sanitizeHtml } from "@/lib/html-sanitizer";

interface AboutData {
  _id: string;
  title: string;
  heroImage?: string;
  heroDescription: string;
  excellenceTitle: string;
  excellenceParagraph1: string;
  excellenceParagraph2: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  valuesTitle: string;
  values: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  achievements: Array<{
    label: string;
    value: string;
  }>;
  team?: Array<{
    name: string;
    position: string;
    bio: string;
    image?: string;
  }>;
  whyChooseUs?: {
    sectionTitle: string;
    sectionSubtitle: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
}

const About = () => {
  const { toast } = useToast();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAboutInfo();
      if (data.success) {
        console.log('✓ About data fetched:', data.data);
        console.log('✓ Hero Image:', data.data.heroImage ? 'Present' : 'Missing');
        setAboutData(data.data);
      }
    } catch (error: any) {
      console.error('✗ Fetch error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch about content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Content Not Found</h1>
          <p className="text-muted-foreground">About page content is not available</p>
        </div>
      </div>
    );
  }

  const iconMap: Record<string, any> = {
    Target,
    Eye,
    Heart,
    Award
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 
              className="text-5xl text-primary font-bold mb-6"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.title) }}
            />
            <p 
              className="text-lg text-justify text-muted-foreground max-w-9xl mx-auto"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.heroDescription) }}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className=" relative justify-center animate-scale-in">
              {aboutData.heroImage && aboutData.heroImage.trim() ? (
                <div className="rounded-lg overflow-hidden items-center  justify-center>">
                  <img 
                    src={aboutData.heroImage} 
                    alt="About Blizzen Creations"
                    className="w-80 h-96 object-cover rounded-lg mx-auto"
                    onLoad={() => console.log('✓ Hero image loaded successfully')}
                    onError={(e) => {
                      console.error('✗ Image failed to load:', e);
                      // Fallback if image fails to load
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-80 h-96 flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600">
                            Blizzen Creations
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="text-center pt-5">
                  <h6 className="text-xl text-primary">Mr.Praveen</h6>
                  <p className="text-gray-600">Director</p>
                  </div>
                </div>
                
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg w-full h-64 flex items-center justify-center text-white text-4xl font-bold">
                  Blizzen Creations
                </div>
              )}
            </div>
          

            <div className="space-y-6 animate-slide-up text-left">
              <h2 
                className="text-3xl font-bold text-left"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.excellenceTitle) }}
              />
              <p 
                className="text-muted-foreground leading-relaxed text-justify font-sans"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.excellenceParagraph1) }}
              />
              <p 
                className="text-muted-foreground leading-relaxed text-justify font-sans"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.excellenceParagraph2) }}
              />
            </div>
           
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {aboutData.achievements.map((achievement, index) => (
              <div key={index} className="text-center text-white animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-5xl font-bold mb-2">{achievement.value}</div>
                <div className="text-white/80">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="hover:shadow-lg hover:bg-blue-50  transition-shadow border-primary/20 animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle 
                  className="text-2xl"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.missionTitle) }}
                />
              </CardHeader>
              <CardContent>
                <p 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.missionDescription) }}
                />
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="hover:shadow-lg  hover:bg-blue-50  transition-shadow border-primary/20 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <CardTitle 
                  className="text-2xl"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.visionTitle) }}
                />
              </CardHeader>
              <CardContent>
                <p 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.visionDescription) }}
                />
              </CardContent>
            </Card>

            {/* Values */}
            {aboutData.values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg  hover:bg-blue-50  transition-shadow border-primary/20 animate-slide-up text-justify" style={{ animationDelay: `${(index + 2) * 0.1}s` }}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle 
                    className="text-2xl"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(value.title) }}
                  />
                </CardHeader>
                <CardContent>
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(value.description) }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold mb-4"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(aboutData.whyChooseUs?.sectionTitle || 'Why Choose Blizzen Creations?')
              }}
            />
            <p 
              className="text-muted-foreground text-lg"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(aboutData.whyChooseUs?.sectionSubtitle || 'What sets us apart from the rest')
              }}
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {aboutData.whyChooseUs?.features && aboutData.whyChooseUs.features.length > 0 ? (
              aboutData.whyChooseUs.features.map((feature, index) => (
                <Card key={index} className="text-center hover:bg-blue-50 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle 
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(feature.title) }}
                    />
                  </CardHeader>
                  <CardContent>
                    <p 
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(feature.description) }}
                    />
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                No features available. Please add features from the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
