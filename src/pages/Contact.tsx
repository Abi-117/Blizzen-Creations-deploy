import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";

interface ContactInfo {
  _id: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: Array<{ label: string; number: string }>;
  email: Array<{ label: string; address: string }>;
  officeHours: Record<string, string>;
  socialLinks?: Record<string, string>;
}

const Contact = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    qualification: "",
    experience: "",
    placementRequired: "",
    message: ""
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContactInfo();
      if (data.success) {
        setContactInfo(data.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch contact info",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const data = await apiService.postEnquiry(formData);

      if (data.success) {
        toast({
          title: "Thank you for your interest!",
          description: "Our counselor will reach out to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          course: "",
          qualification: "",
          experience: "",
          placementRequired: "",
          message: ""
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to submit enquiry. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 animate-fade-in">Get In Touch</h1>
          <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Ready to start your IT career journey? Contact us today and let's discuss your goals.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Address */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Visit Us</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {contactInfo?.companyName}<br />
                        {contactInfo?.address}<br />
                        {contactInfo?.city}, {contactInfo?.state} {contactInfo?.zipCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Call Us</h3>
                      <div className="text-sm sm:text-base text-muted-foreground">
                        {contactInfo?.phone.map((p, idx) => (
                          <div key={idx} className="mb-1">{p.number}</div>
                        ))}
                        <div className="mt-2 text-xs sm:text-sm">Mon-Sat: 9 AM - 7 PM</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Email Us</h3>
                      <div className="text-sm sm:text-base text-muted-foreground">
                        {contactInfo?.email.map((e, idx) => (
                          <div key={idx} className="mb-1 break-all">{e.address}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Office Hours</h3>
                      <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <div>Mon-Fri: {contactInfo?.officeHours?.monday}</div>
                        <div>Sat: {contactInfo?.officeHours?.saturday}</div>
                        <div>Sun: {contactInfo?.officeHours?.sunday}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enquiry Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold">Course Enquiry Form</CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Fill out the form below and we'll get back to you shortly</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm sm:text-base font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                          className="text-sm sm:text-base h-10 sm:h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm sm:text-base font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                          className="text-sm sm:text-base h-10 sm:h-11"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm sm:text-base font-medium">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          required
                          className="text-sm sm:text-base h-10 sm:h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="course" className="text-sm sm:text-base font-medium">Course Interested In *</Label>
                        <Select value={formData.course} onValueChange={(value) => handleChange("course", value)} required>
                          <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="python-fullstack" className="text-sm sm:text-base">Python Full Stack Development</SelectItem>
                            <SelectItem value="web-development" className="text-sm sm:text-base">Web Development</SelectItem>
                            <SelectItem value="ai-machine-learning" className="text-sm sm:text-base">AI & Machine Learning</SelectItem>
                            <SelectItem value="data-science-analytics" className="text-sm sm:text-base">Data Science & Analytics</SelectItem>
                            <SelectItem value="cloud-devops" className="text-sm sm:text-base">Cloud Computing & DevOps</SelectItem>
                            <SelectItem value="cybersecurity" className="text-sm sm:text-base">Cybersecurity</SelectItem>
                            <SelectItem value="ui-ux-design" className="text-sm sm:text-base">UI/UX Design</SelectItem>
                            <SelectItem value="digital-marketing" className="text-sm sm:text-base">Digital Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="qualification" className="text-sm sm:text-base font-medium">Highest Qualification</Label>
                        <Select value={formData.qualification} onValueChange={(value) => handleChange("qualification", value)}>
                          <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10th" className="text-sm sm:text-base">10th Grade</SelectItem>
                            <SelectItem value="12th" className="text-sm sm:text-base">12th Grade</SelectItem>
                            <SelectItem value="diploma" className="text-sm sm:text-base">Diploma</SelectItem>
                            <SelectItem value="graduate" className="text-sm sm:text-base">Graduate</SelectItem>
                            <SelectItem value="postgraduate" className="text-sm sm:text-base">Post Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-sm sm:text-base font-medium">Work Experience</Label>
                        <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)}>
                          <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fresher" className="text-sm sm:text-base">Fresher</SelectItem>
                            <SelectItem value="0-1" className="text-sm sm:text-base">0-1 Year</SelectItem>
                            <SelectItem value="1-3" className="text-sm sm:text-base">1-3 Years</SelectItem>
                            <SelectItem value="3-5" className="text-sm sm:text-base">3-5 Years</SelectItem>
                            <SelectItem value="5+" className="text-sm sm:text-base">5+ Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="placement" className="text-sm sm:text-base font-medium">Placement Support Required?</Label>
                      <Select value={formData.placementRequired} onValueChange={(value) => handleChange("placementRequired", value)}>
                        <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes" className="text-sm sm:text-base">Yes</SelectItem>
                          <SelectItem value="no" className="text-sm sm:text-base">No</SelectItem>
                          <SelectItem value="maybe" className="text-sm sm:text-base">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm sm:text-base font-medium">Additional Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your goals and expectations..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        className="text-sm sm:text-base resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all text-sm sm:text-base h-11 sm:h-12 font-medium" 
                      disabled={formLoading}
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span className="text-sm sm:text-base">Submitting...</span>
                        </>
                      ) : (
                        <span className="text-sm sm:text-base">Submit Enquiry</span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Find Us Here</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Visit our campus and experience world-class facilities</p>
          </div>
          <Card className="overflow-hidden shadow-xl">
            <div 
              className="h-64 sm:h-80 md:h-96 relative cursor-pointer group"
              onClick={() => window.open('https://www.google.com/maps/place/Blizzen+Creation\'s/@13.0856169,80.2127239,1056m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3a526500531a313b:0xd55b6f4b2ed37998!8m2!3d13.0856169!4d80.2127239!16s%2Fg%2F11xlxs8lxf?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D', '_blank')}
            >
              {/* Map iframe with pointer-events disabled */}
              <div className="absolute inset-0 pointer-events-none">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6855936595443!2d80.21054257589744!3d13.085616987248896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526500531a313b%3A0xd55b6f4b2ed37998!2sBlizzen%20Creation&#39;s!5e0!3m2!1sen!2sin!4v1730630400000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Blizzen Creations Location"
                  className="rounded-lg"
                />
              </div>
              
              
              
              {/* Location Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg z-20 pointer-events-none">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-xs sm:text-sm">Blizzen Creation's</p>
                    <p className="text-xs text-muted-foreground">Chennai, Tamil Nadu</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          
        </div>
      </section>
    </div>
  );
};

export default Contact;
