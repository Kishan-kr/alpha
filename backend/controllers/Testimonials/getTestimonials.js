const Testimonials = require("../../models/testimonials");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonials.find({isActive: true}).sort({ date: -1 });
    res.status(200).json({ message: "Testimonials fetched successfully", testimonials });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = getTestimonials;