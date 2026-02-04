import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import enquiryRoutes from './routes/enquiry.js';
import courseRoutes from './routes/courses.js';
import placementRoutes from './routes/placements.js';
import placementStatsRoutes from './routes/placement-stats.js';
import contactInfoRoutes from './routes/contact-info.js';
import aboutRoutes from './routes/about.js';
import homeContentRoutes from './routes/home-content.js';
import uploadRoutes from './routes/upload.js';
import trustStatsRoutes from './routes/trust-stats.js';
import footerContentRoutes from './routes/footer-content.js';
import blogRoutes from './routes/blog.js';
import navbarRoutes from './routes/navbar.js';
import galleryRoutes from './routes/gallery.js';
import landingRoutes from './routes/landing.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🚀 Blizzen Backend starting in ${NODE_ENV} mode...`);

// ------------------------
// ✅ CORS Setup
// ------------------------
const allowedOrigins = [
  'https://www.blizzencreations.in',
  'https://blizzen-creations-deploy.onrender.com',
  'https://blizzen-creations-7m1wlle0p-zenelaits-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8081',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman/server-to-server
    if (!allowedOrigins.includes(origin)) {
      console.warn(`⚠️ CORS blocked for origin: ${origin}`);
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// ------------------------
// ✅ Body Parsing
// ------------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ------------------------
// ✅ Serve Uploaded Files
// ------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------
// ✅ MongoDB Connection
// ------------------------
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✓ MongoDB connected'))
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

// ------------------------
// ✅ API Routes
// ------------------------
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/placement-stats', placementStatsRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/home-content', homeContentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/trust-stats', trustStatsRoutes);
app.use('/api/footer-content', footerContentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/navbar', navbarRoutes);
app.use('/api/landing', landingRoutes);
app.use("/api/gallery", galleryRoutes);

// ------------------------
// ✅ Health Check
// ------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', time: new Date() });
});

// ------------------------
// ✅ Global Error Handler
// ------------------------
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: err.message });
});

// ------------------------
// ✅ Start Server
// ------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
