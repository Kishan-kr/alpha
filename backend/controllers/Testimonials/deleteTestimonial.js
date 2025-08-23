const Testimonials = require("../../models/testimonials");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Testimonials.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error.message);
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

module.exports = deleteTestimonial;
