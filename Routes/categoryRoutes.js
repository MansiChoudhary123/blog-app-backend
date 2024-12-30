const express = require("express");
const categoryControllers = require("../Controllers/categoryController");
const e = require("express");
const router = express.Router();

router.get("/categories", categoryControllers.fetchAllCategory);

module.exports = router;
