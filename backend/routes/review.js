const express = require("express")
const router = express.Router()
const authenticateUser = require("../middlwares/authenticateUser")
const addReview = require("../controllers/Review/addReview")
const { body } = require("express-validator")
const updateReview = require("../controllers/Review/updateReview")
const deleteReview = require("../controllers/Review/deleteReview")
const getReviewByProductId = require("../controllers/Review/getReviewByProductId")

//add review
router.post("/add-review/:productId", authenticateUser, [
    body("rating")
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be a number between 1 and 5"),

    // 2. Comment must be at least 2 characters
    body("comment")
        .isString()
        .isLength({ min: 2 })
        .withMessage("Comment must be at least 2 characters long")
], addReview)

//update review
router.patch("/update-review/:reviewId" , authenticateUser , [
     body("rating")
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be a number between 1 and 5"),

    // 2. Comment must be at least 2 characters
    body("comment")
        .isString()
        .isLength({ min: 2 })
        .withMessage("Comment must be at least 2 characters long")
], updateReview)

//delete rview
router.delete("/delete-review/:reviewId" , authenticateUser , deleteReview)

//get review by Id
router.get("/get-Review/:productId"  , getReviewByProductId)


module.exports = router