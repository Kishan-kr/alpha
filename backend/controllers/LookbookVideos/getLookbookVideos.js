const LookbookVideo = require("../../models/lookBookVideo");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const getLookbookVideos = async (req, res) => {
  try {
    const videos = await LookbookVideo.find({isActive: true}).sort({ sortOrder: 1 });
    res.status(200).json({ message: "Lookbook videos fetched successfully", videos });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = getLookbookVideos;