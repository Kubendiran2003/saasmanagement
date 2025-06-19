const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.use(protect);
router.route("/:clientId").post(createProduct).get(getProducts);
router.route("/item/:id").put(updateProduct).delete(deleteProduct);

module.exports = router;
