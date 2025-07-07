const express = require("express");
const getTestimonials = require("../controllers/Testimonials/getTestimonials");
const addTestimonial = require("../controllers/Testimonials/addTestimonial");
const deleteTestimonial = require("../controllers/Testimonials/deleteTestimonial");
const updateTestimonialStatus = require("../controllers/Testimonials/updateTestimonialStatus");
const authenticateAdmin = require("../middlwares/authenticateAdmin");
const router = express.Router()

// GET /api/testimonials
router.get('/', getTestimonials);

// POST /api/testimonials
router.post('/', authenticateAdmin, addTestimonial);

// PATCH /api/testimonials/:id/status
router.patch('/:id/status', authenticateAdmin, updateTestimonialStatus);

// DELETE /api/testimonials/:ID
router.delete('/:id', authenticateAdmin, deleteTestimonial);

module.exports = router;