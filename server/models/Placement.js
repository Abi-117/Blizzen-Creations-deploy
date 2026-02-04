import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    course: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required']
    },
    position: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Placement', placementSchema);
