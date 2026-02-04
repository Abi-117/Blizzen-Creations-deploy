import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { apiService } from "@/services/api";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import logo from "@/assets/logo.png";
import devLogo from "@/assets/dev_logo.png";

interface ContactInfo {
  companyName: string;
  address: string;
  city: string;
  state: string;
  phone: Array<{ label: string; number: string }>;
  email: Array<{ label: string; address: string }>;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  isActive: boolean;
}

interface QuickLink {
  label: string;
  path: string;
  isActive: boolean;
}

interface PopularCourse {
  courseId: string;
  title: string;
  slug: string;
}

interface FooterContent {
  description: string;
  socialLinks: SocialLink[];
  quickLinks: QuickLink[];
  popularCourses: PopularCourse[];
  showSocialLinks: boolean;
  showQuickLinks: boolean;
  showPopularCourses: boolean;
  copyright: string;
}

const Footer = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const [contactData, coursesData, footerData] = await Promise.all([
        apiService.getContactInfo(),
        apiService.getCourses(),
        apiService.getFooterContent(),
      ]);

      if (contactData.success) setContactInfo(contactData.data);
      if (coursesData.success) setCourses(coursesData.data.slice(0, 4));
      setFooterContent(footerData);
    } catch (error) {
      console.error("Failed to fetch footer data:", error);
    }
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Facebook":
        return Facebook;
      case "Instagram":
        return Instagram;
      case "Linkedin":
        return Linkedin;
      case "Youtube":
        return Youtube;
      default:
        return Facebook;
    }
  };

  return (
    <footer className="bg-gradient-to-br from-primary/5 to-accent/5 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="">
            <div className="flex items-start -mt-0">
              <div className="h-20 w-32 overflow-hidden">
                <img 
                  src={logo} 
                  alt="Blizzen Creations" 
                  className="h-full w-auto object-cover object-left -mt-4"
                />
              </div>
            </div>
            <p 
              className="text-muted-foreground text-sm text-justify leading-relaxed -mt-8"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(footerContent?.description || "Transforming careers through comprehensive IT training, hands-on projects, and guaranteed placement support in Chennai, Tamil Nadu.")
              }}
            />
            {footerContent?.showSocialLinks && (
              <div className="flex space-x-4">
                {footerContent.socialLinks
                  .filter((link) => link.isActive)
                  .map((link, index) => {
                    const IconComponent = getSocialIcon(link.icon);
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={link.name}
                      >
                        <IconComponent size={20} />
                      </a>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          {footerContent?.showQuickLinks && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {footerContent.quickLinks
                  .filter((link) => link.isActive)
                  .map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Popular Courses */}
          {footerContent?.showPopularCourses !== false && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Popular Courses</h4>
              <ul className="space-y-2 text-sm">
                {footerContent?.popularCourses && footerContent.popularCourses.length > 0 ? (
                  footerContent.popularCourses.map((course, index) => (
                    <li key={index}>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {course.title}
                      </Link>
                    </li>
                  ))
                ) : courses.length > 0 ? (
                  courses.map((course) => (
                    <li key={course._id}>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {course.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                        Python Full Stack Development
                      </Link>
                    </li>
                    <li>
                      <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                        Data Science & Analytics
                      </Link>
                    </li>
                    <li>
                      <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                        AI & Machine Learning
                      </Link>
                    </li>
                    <li>
                      <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                        Web Development
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>{contactInfo ? `${contactInfo.city}, ${contactInfo.state}` : "Chennai, Tamil Nadu, India"}</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone size={16} />
                <span>{contactInfo?.phone?.[0]?.number || "+91 XXXXX XXXXX"}</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail size={16} />
                <span>{contactInfo?.email?.[0]?.address || "info@blizzencreations.com"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-blue-600 text-white text-center text-sm py-4">
        <div className="container mx-auto px-4">
          <p 
            className="m-0 mb-2"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeHtml(footerContent?.copyright || `© ${new Date().getFullYear()} ${contactInfo?.companyName || "Blizzen Creations"}. All rights reserved.`)
            }}
          />
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/90">Developed by</span>
            <div className="bg-white rounded-full px-3 py-1 flex items-center justify-center">
              <img src={devLogo} alt="Developer" className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
