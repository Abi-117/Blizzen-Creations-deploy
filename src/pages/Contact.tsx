import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";

/* ================= TYPES ================= */

interface OfficeHours {
  monday: string;
  saturday: string;
  sunday: string;
}

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
  officeHours?: Partial<OfficeHours>;
  socialLinks?: Record<string, string>;
}

/* ================= SAFE DEFAULT ================= */

const DEFAULT_OFFICE_HOURS: OfficeHours = {
  monday: "9:00 AM – 7:00 PM",
  saturday: "9:00 AM – 5:00 PM",
  sunday: "Closed",
};

/* ================= COMPONENT ================= */

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
    message: "",
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContactInfo();
      if (data?.success) {
        setContactInfo(data.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch contact info",
        variant: "destructive",
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
      if (data?.success) {
        toast({
          title: "Thank you for your interest!",
          description:
            "Our counselor will reach out to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          course: "",
          qualification: "",
          experience: "",
          placementRequired: "",
          message: "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ======= 🔐 CRITICAL FIX (NO MORE monday ERROR) ======= */

  const officeHours: OfficeHours = {
    ...DEFAULT_OFFICE_HOURS,
    ...(contactInfo?.officeHours || {}),
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
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Ready to start your IT career journey? Contact us today.
          </p>
        </div>
      </section>

      {/* Contact + Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-10">

          {/* Address */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <MapPin className="text-primary" />
                <div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground text-sm">
                    {contactInfo?.companyName}<br />
                    {contactInfo?.address}<br />
                    {contactInfo?.city}, {contactInfo?.state}{" "}
                    {contactInfo?.zipCode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phone */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Phone className="text-primary" />
                <div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  {contactInfo?.phone?.map((p, i) => (
                    <div key={i} className="text-sm text-muted-foreground">
                      {p.number}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Mail className="text-primary" />
                <div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  {contactInfo?.email?.map((e, i) => (
                    <div key={i} className="text-sm text-muted-foreground break-all">
                      {e.address}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Clock className="text-primary" />
                <div>
                  <h3 className="font-semibold mb-2">Office Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Mon–Fri: {officeHours.monday}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Saturday: {officeHours.saturday}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sunday: {officeHours.sunday}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* MAP (UNCHANGED) */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6855936595443!2d80.21054257589744!3d13.085616987248896"
              width="100%"
              height="400"
              loading="lazy"
              style={{ border: 0 }}
            />
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;
