const express = require("express")
const router = express.Router()
const authenticateUser = require("../middlwares/authenticateUser")
const addReview = require("../controllers/Review/addReview")
const { body } = require("express-validator")
const updateReview = require("../controllers/Review/updateReview")
const deleteReview = require("../controllers/Review/deleteReview")
const getReviewByProductId = require("../controllers/Review/getReviewByProductId")
const { uploadImagesIfPresent, upload } = require("../middlwares/uploadImage")
const getReviewById = require("../controllers/Review/getReviewById")

// add review
router.post("/:productId", authenticateUser,
    upload.array('images'),
    uploadImagesIfPresent, [
    body("rating")
        .exists().withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be a number between 1 and 5"),

    // 2. Comment must be at least 3 characters
    body("comment")
        .exists().withMessage("Comment is required")
        .isString().withMessage("Comment must be a string")
        .trim()
        .isLength({ min: 3, max: 1000 })
        .withMessage("Comment must be between 3 and 1000 characters long")
], addReview)

// update review
router.patch("/:reviewId", authenticateUser,
    upload.array('images'),
    uploadImagesIfPresent, [
    body("rating")
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be a number between 1 and 5"),

    // 2. Comment must be at least 3 characters
    body("comment")
        .optional()
        .isString().withMessage("Comment must be a string")
        .trim()
        .isLength({ min: 3, max: 1000 })
        .withMessage("Comment must be between 3 and 1000 characters long")
], updateReview)

// delete a review
router.delete("/:reviewId", authenticateUser, deleteReview)

// get reviews of a product by product id
router.get("/product/:productId", getReviewByProductId)

// get review by Id
router.get("/:reviewId", getReviewById)


module.exports = router