const CategoryModel = require("./../models/categoryModel");

exports.getCategories = (req, res) => {
  const name = req.body.name;
  console.log(req.body);
  const newCategoryModel = new CategoryModel({ name });
  newCategoryModel
    .save()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => console.error("Error", err));
};
