import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { apiService } from "@/services/api";
import EnquiryPopup from "./EnquiryPopup";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const location = useLocation();
  const [navbarData, setNavbarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const data = await apiService.getNavbar();
        setNavbarData(data);
      } catch (error) {
        console.error("Error fetching navbar:", error);
        // Fallback to default links on error
        setNavbarData({
          logo: logo,
          links: [
            { name: "Home", path: "/", isActive: true, order: 1 },
            { name: "About", path: "/about", isActive: true, order: 2 },
            { name: "Courses", path: "/courses", isActive: true, order: 3 },
            { name: "Placements", path: "/placements", isActive: true, order: 4 },
            { name: "Blog", path: "/blog", isActive: true, order: 5 },
            { name: "Overview", path: "/landing", isActive: true, order: 6 },
            { name: "Gallery", path: "/gallery", isActive: true, order: 7 },
            { name: "Contact", path: "/contact", isActive: true, order: 8 },
          ],
          showEnquiryButton: true,
          enquiryButtonText: "Enquire Now"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchNavbar();
  }, []);

  const navLinks = navbarData?.links
    ?.filter((link: any) => link.isActive)
    .sort((a: any, b: any) => a.order - b.order) || [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-background/85 backdrop-blur-md border-b border-border z-50 shadow-soft">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={navbarData?.logo || logo}
              alt="Blizzen Creations"
              className="h-20 w-auto group-hover:scale-110 transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link: any, index: number) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-all duration-300 relative group ${isActive(link.path)
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full ${isActive(link.path) ? "w-full" : ""
                  }`}></span>
              </Link>
            ))}
            {navbarData?.showEnquiryButton && (
              <Button
                onClick={() => setIsEnquiryOpen(true)}
                className="bg-gradient-primary hover:opacity-90 text-white font-semibold"
              >
                {navbarData?.enquiryButtonText || "Enquire Now"}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-slide-down glass rounded-lg p-4 border border-primary/20">
            {navLinks.map((link: any, index: number) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block font-medium transition-all duration-300 p-2 rounded-lg hover:bg-primary/10 ${isActive(link.path)
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:text-primary"
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </Link>
            ))}
            {navbarData?.showEnquiryButton && (
              <Button
                onClick={() => {
                  setIsEnquiryOpen(true);
                  setIsOpen(false);
                }}
                className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold"
              >
                {navbarData?.enquiryButtonText || "Enquire Now"}
              </Button>
            )}
          </div>
        )}
      </div>
      <EnquiryPopup isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </nav>
  );
};

export default Navbar;
