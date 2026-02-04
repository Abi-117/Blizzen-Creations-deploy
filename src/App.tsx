import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Placements from "./pages/Placements";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import EnquiryPopup from "./components/EnquiryPopup";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import QuickAccessButtons from "./components/QuickAccessButtons";
import { useScrollEnquiry } from "./hooks/useScrollEnquiry";
import LandingPage from "./pages/Landing";
import Gallery from "./pages/Gallery";

const queryClient = new QueryClient();

const App = () => {
  const { showPopup, closePopup } = useScrollEnquiry({
    scrollThreshold: 1, // Show immediately when user scrolls
    delay: 0, // No delay
    showOnce: true // Show only once per session
  });
const hideNavbarFooter = location.pathname === "/landing"; 
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            {!hideNavbarFooter && <Navbar />}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:slug" element={<CourseDetail />} />
                <Route path="/placements" element={<Placements />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/Admin" element={<Admin />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {!hideNavbarFooter && <Footer />}
            
            {/* Scroll-triggered Enquiry Popup */}
            <EnquiryPopup isOpen={showPopup} onClose={closePopup} />
            
            {/* Quick Access Buttons */}
            <QuickAccessButtons />
            
            {/* Scroll to Top Button */}
            <ScrollToTopButton />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
