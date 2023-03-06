const Order = require("../models/order");
const nodemailer = require("nodemailer");
const senGridTransport = require("nodemailer-sendgrid-transport");
const Product = require("../models/product");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport(
  senGridTransport({
    auth: {
      api_key: process.env.API_KEY_SENGRID,
    },
  })
);

class OrderController {
  // create new order
  createOrder = (req, res, next) => {
    const { phone, email, total, fullName, address } = req.body;
    const userId = req.user._id;
    const cart = req.user.cart;
    const items = cart.items;

    //check stock
    items.map((item) => {
      Product.findById(item.productId)
        .then((product) => {
          const stockOld = product.stock;
          if (item.quantity > stockOld) {
            res.status(400).send("---Out of stock---");
          } else {
            Product.findByIdAndUpdate(item.productId, {
              $set: {
                stock: stockOld - item.quantity,
              },
            }).then((result) => console.log("updated stock!!!"));
          }
        })
        .catch((err) => console.log(err));
    });
    //content mail
    const htmlHead =
      '<table style="width:80%">' +
      '<tr style="border: 1px solid black;"><th style="border: 1px solid black;">Tên Sản Phẩm</th><th style="border: 1px solid black;">Hình Ảnh</th><th style="border: 1px solid black;">Giá</th><th style="border: 1px solid black;">Số Lượng</th><th style="border: 1px solid black;">Thành Tiền</th>';

    let htmlContent = "";

    for (let i = 0; i < items.length; i++) {
      htmlContent +=
        "<tr>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        items[i].nameProduct +
        "</td>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;"><img src="' +
        items[i].img +
        '" width="80" height="80"></td>' +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        items[i].priceProduct.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
        " " +
        "VNĐ</td>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        items[i].quantity +
        "</td>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        (parseInt(items[i].priceProduct) * parseInt(items[i].quantity))
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
        " " +
        "VNĐ</td><tr>";
    }

    const htmlResult =
      "<h1>Xin Chào " +
      fullName +
      "</h1>" +
      "<h3>Phone: " +
      phone +
      "</h3>" +
      "<h3>Address:" +
      address +
      "</h3>" +
      htmlHead +
      htmlContent +
      "<h1>Tổng Thanh Toán: " +
      total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
      " " +
      "VNĐ</br>" +
      "<p>Cảm ơn bạn!</p>";

    const newOrder = new Order({
      userId: userId,
      phoneNumber: phone,
      email: email,
      total: total,
      fullName: fullName,
      address: address,
      orders: cart,
    });

    newOrder
      .save()
      .then((result) => {
        req.user.clearCart();
        res.status(200).send(result);
        transporter
          .sendMail({
            from: "datltFX16810@funix.edu.vn",
            to: email,
            subject: "Hóa Đơn Đặt Hàng",
            html: htmlResult,
          })
          .then((result) => {
            console.log("----order.js111-----", result);
          });
      })
      .catch((err) => console.log(err));
  };

  //get order( user)
  getOrderUser = (req, res, next) => {
    Order.find({ userId: req.user._id })
      .then((order) => {
        if (order) {
          res.status(200).send(order);
        } else {
          throw new Error("No order!!!");
        }
      })
      .catch((err) => console.log(err));
  };

  //get order
  getOrder = (req, res, next) => {
    Order.findById(req.params.orderId)
      .then((order) => {
        if (order) {
          res.status(200).send(order);
        } else {
          throw new Error("Not found order!!!");
        }
      })
      .catch((err) => console.log(err));
  };
}

module.exports = new OrderController();
