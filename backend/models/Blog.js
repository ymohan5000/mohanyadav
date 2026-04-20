const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    image: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]+>/g, '').substring(0, 160);
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
