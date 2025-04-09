const mongoose = require("mongoose");

const poemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // or String if not referencing a User model
      ref: "User",
      required: true,
    },
    stanzas: {
      type: [String],
      required: true,
    },
    stanzaCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

poemSchema.pre("save", function (next) {
  this.stanzaCount = this.stanzas.length;
  next();
});

module.exports = mongoose.model("Poem", poemSchema);
