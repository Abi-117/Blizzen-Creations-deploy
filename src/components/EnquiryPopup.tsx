import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X, Phone, Mail, User, MessageSquare, Loader2 } from "lucide-react";

interface EnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryPopup = ({ isOpen, onClose }: EnquiryPopupProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Google Apps Script Web App URL (you'll need to replace this with your actual URL)
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'Website Popup'
        })
      });

      // Since we're using no-cors mode, we can't read the response
      // We'll assume success if no error is thrown
      toast({
        title: "Enquiry Submitted!",
        description: "Thank you for your interest. We'll contact you soon."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        message: ""
      });

      // Close popup after successful submission
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Enquiry submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex mt-96 items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl text-center text-primary">
            Quick Enquiry
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Get personalized course guidance from our experts
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium">Full Name *</label>
              </div>
              <Input
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium">Email Address *</label>
              </div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium">Phone Number *</label>
              </div>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            {/* Course Interest */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Course of Interest</label>
              <select
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Select a course</option>
                <option value="Python Full Stack Development">Python Full Stack Development</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Web Development">Web Development</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium">Message (Optional)</label>
              </div>
              <Textarea
                placeholder="Any specific questions or requirements?"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover-glow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Enquiry"
              )}
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree to our privacy policy. 
              We'll only use your information to contact you about our courses.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnquiryPopup;