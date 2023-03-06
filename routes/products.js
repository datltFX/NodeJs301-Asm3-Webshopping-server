const express = require("express");
const ProductController = require("../controllers/products");
const uploadFile = require("../configs/cloudinary.config");
const { verifyAdmin } = require("../middlewares/verifyDecentralization");
const router = express.Router();

//GET all product(admin-client)
router.get("/products", ProductController.getProducts);
//GET product-detail
router.get("/products/:prodId", ProductController.getDetailProduct);
//POST search product (admin)
router.post("/products/search", ProductController.searchProduct);

//POST new product
router.post(
  "/products/new-product",
  verifyAdmin,
  uploadFile.array("images"),
  ProductController.addProduct
);
//PUT update product
router.put(
  "/products/:productId",
  verifyAdmin,
  uploadFile.array("images"),
  ProductController.editProduct
);
//DELETE Product
router.delete(
  "/products/:productId",
  verifyAdmin,
  ProductController.deleteProduct
);

module.exports = router;
