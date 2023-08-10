const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
//

/* ----------------------- Delete One ----------------------- */
//
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError("Couldn't find Doc with id : ${}", 400));
    }
    document.remove();
    return res.json({
      status: res.status,
      message: "Deleted Successfully",
    });
  });

/* ----------------------------- Update Handler ----------------------------- */
//
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`Couldn't Update the doc with id: ${req.params.id}`, 400)
      );
    }
    document.save();
    return res.json({
      status: res.status,
      document,
    });
  });

/* ----------------------------- Create Handler ----------------------------- */
//
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);

    return res.json({
      status: req.status,
      data: newDoc,
    });
  });

/* ----------------------------- Get One Handler ---------------------------- */
//
exports.getOne = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOption) {
      query = query.populate(populationOption);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError("No document Found", 400));
    }

    return res.json({
      status: res.status,
      data: document,
    });
  });

/* ---------------------------- get All Documents --------------------------- */
exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;
    const documentCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentCounts)
      .filter()
      .search(modelName)
      .limit()
      .sort();
    const { mongooseQuery, paginationResult } = apiFeatures;
    const document = await mongooseQuery;
    return res.json({
      status: res.status,
      dataLength: document.length,
      paginationResult,
      data: document,
    });
  });
