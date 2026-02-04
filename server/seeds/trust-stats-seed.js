import mongoose from 'mongoose';
import TrustStats from '../models/TrustStats.js';
import dotenv from 'dotenv';

dotenv.config();

const seedTrustStats = async () => {
  try {
    console.log('🌱 Seeding trust stats...');

    // Clear existing data
    await TrustStats.deleteMany({});
    console.log('✓ Cleared existing trust stats');

    // Create default trust stats
    const trustStats = new TrustStats({
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
        },
        {
          name: 'Glassdoor',
          rating: 4.7,
          icon: 'glassdoor',
          color: '#0CAA41',
          isActive: true
        },
        {
          name: 'Indeed',
          rating: 4.6,
          icon: 'indeed',
          color: '#2557A7',
          isActive: true
        }
      ],
      isActive: true
    });

    await trustStats.save();
    console.log('✓ Trust stats seeded successfully');

    console.log('🎉 Trust stats seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding trust stats:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✓ Connected to MongoDB');
      return seedTrustStats();
    })
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedTrustStats;