const express = require("express");
const OrderController = require("../controllers/orders");
const { verifyUser } = require("../middlewares/verifyDecentralization");
const router = express.Router();
//POST order
router.post("/", verifyUser, OrderController.createOrder);
//GET order user
router.get("/", verifyUser, OrderController.getOrderUser);
//GET detail order user
router.get("/:orderId", verifyUser, OrderController.getOrder);
module.exports = router;
