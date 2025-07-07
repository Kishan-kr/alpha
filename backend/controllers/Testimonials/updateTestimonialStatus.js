// controllers/testimonialController.js

const Testimonials = require('../../models/testimonials');
const { INTERNAL_SERVER_ERROR } = require('../../utilis/constants');

const updateTestimonialStatus = async (req, res) => {
  const statusMap = {
    'active': true,
    'inactive': false
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await Testimonials.findByIdAndUpdate(
      id,
      { isActive: statusMap[status] },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

module.exports = updateTestimonialStatus;
