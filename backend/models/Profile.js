const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Your Name' },
    title: { type: String, default: 'Full Stack Developer' },
    bio: { type: String, default: '' },
    about: { type: String, default: '' },
    avatar: { type: String, default: '' },
    resume: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    skills: [{ name: String, level: Number }],
    gallery: [{ url: String, caption: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
