const express = require("express");
const getLookbookVideos = require("../controllers/LookbookVideos/getLookbookVideos");
const router = express.Router()

// GET /api/lookbooks
router.get('/', getLookbookVideos);

module.exports = router;