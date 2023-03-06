const express = require("express");
const CartController = require("../controllers/cart");
const { verifyUser } = require("../middlewares/verifyDecentralization");
const router = express.Router();

//GET cart
router.get("/", verifyUser, CartController.getCart);
//POST cart
router.post("/addCart", verifyUser, CartController.postCart);
//DELETE cart
router.delete(
  "/deleteProductCart/:productId",
  verifyUser,
  CartController.deleteCart
);
//PUT cart
router.put("/updateCart", verifyUser, CartController.updateCart);

module.exports = router;
