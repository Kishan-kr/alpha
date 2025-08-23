const category = require("../../models/category");
const { getFileKeyFromUrl, deleteFromR2 } = require("../../services/configR2");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const CustomError = require("../../utils/customError");

const deleteCategory = async (req, res) => {
    const id = req.params.id;

    try {
        if (!id) {
            throw new CustomError(`Category ID is required`, 400);
        }

        const deletedCategory = await category.findByIdAndDelete(id);
        if (!deletedCategory) {
            throw new CustomError(`Category not found`, 404);
        }

        let failedToDelete = null;

        // Delete thumbnail if exists
        if (deletedCategory.thumbnail) {
            const key = getFileKeyFromUrl(deletedCategory.thumbnail);
            if (!key) {
                failedToDelete = 'Failed to remove thumbnail: Invalid file URL';
            } else {
                const deletedFile = await deleteFromR2(key);
                if (!deletedFile) {
                    failedToDelete = 'Failed to remove thumbnail';
                }
            }
        }

        return res.status(200).json({ 
            status: true, 
            message: "Category Deleted", 
            deletedCategoryId: deletedCategory._id,
            thumbnailDeletion: failedToDelete ? { success: false, message: failedToDelete } : { success: true }
        });

    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
};

module.exports = deleteCategory