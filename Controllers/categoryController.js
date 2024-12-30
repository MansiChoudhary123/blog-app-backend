const category = require("../Modals/categoryModel");

exports.fetchAllCategory = async (req, res) => {
  try {
    const getAllCategory = await category.find();

    if (getAllCategory.length === 0) {
      return res.status(404).json({
        message: "no category found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "category get successfully...",
      categories: getAllCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching categories",
    });
  }
};
