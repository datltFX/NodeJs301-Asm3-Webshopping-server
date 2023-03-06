const express = require("express");
const AdminController = require("../controllers/admin");
const { verifyAdmin } = require("../middlewares/verifyDecentralization");
const router = express.Router();

//GET count clients

router.get("/clients", verifyAdmin, AdminController.getCountClient);

// GET earning
router.get("/orders/earning", verifyAdmin, AdminController.getEarning);

// GET count order
router.get("/orders/count", verifyAdmin, AdminController.getCountOrder);

//GET all orders
router.get("/orders/all", verifyAdmin, AdminController.getOrdersAll);

module.exports = router;
