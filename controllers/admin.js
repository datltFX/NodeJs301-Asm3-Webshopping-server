const User = require("../models/user");
const Order = require("../models/order");

class adminController {
  // Get count client
  getCountClient = async (req, res, next) => {
    try {
      const count = await User.countDocuments();
      res.status(200).json(count);
    } catch (err) {
      console.log(err);
    }
  };

  //get earning
  getEarning = async (req, res, next) => {
    try {
      const orders = await Order.find();
      const totalP = orders.reduce((total, item) => {
        return total + Number(item.total);
      }, 0);
      const startDate = orders[0].createdAt;
      const endDate = orders[orders.length - 1].createdAt;

      function getMonthDifference(startDate, endDate) {
        return (
          endDate.getMonth() -
          startDate.getMonth() +
          12 * (endDate.getFullYear() - startDate.getFullYear())
        );
      }

      const months = getMonthDifference(startDate, endDate) || 1;

      const average = (totalP / months).toFixed();
      res.status(200).json(average);
    } catch (err) {
      console.log(err);
    }
  };

  //get count of order
  getCountOrder = async (req, res, next) => {
    try {
      const countOrder = await Order.countDocuments();
      res.status(200).json(countOrder);
    } catch (err) {
      console.log(err);
    }
  };

  //get all order
  getOrdersAll = async (req, res, next) => {
    Order.find()
      .then((orders) => {
        res.status(200).send(orders);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
module.exports = new adminController();
