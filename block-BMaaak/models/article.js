var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tags: [String],
  },
  { timestamps: true }
);
articleSchema.index({ tags: 1 });
articleSchema.index({ title: 'text', description: 'text' });
var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
