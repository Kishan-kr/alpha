const Testimonials = require("../../models/testimonials");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

// POST /api/testimonials
const addTestimonial = async (req, res) => {
  try {
    const { rating, comment, name, product, date } = req.body;

    // Basic validation (can be expanded)
    if (!rating || !comment || !name || !product || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newTestimonial = new Testimonials({
      rating,
      comment,
      name,
      product,
      date
    });

    const saved = await newTestimonial.save();
    res.status(201).json({message: 'Testimonial added successfully', testimonial: saved});
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

module.exports = addTestimonial;
