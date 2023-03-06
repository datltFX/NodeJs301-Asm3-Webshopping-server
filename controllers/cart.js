const Product = require("../models/product");

class CartController {
  //GET cart
  getCart = (req, res, next) => {
    res.status(200).send(req.user.cart.items);
  };

  //POST add cart
  postCart = (req, res, next) => {
    // console.log("---cart11---", req.body);
    const { productId, quantity } = req.body;

    Product.findById(productId)
      .then((product) => {
        return req.user.addToCart(product, quantity);
      })
      .then((result) => {
        res.status(200).send(result.cart);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //delete cart
  deleteCart = (req, res, next) => {
    req.user
      .removeFromCart(req.params.productId)
      .then((result) => {
        res.status(200).send(result.cart);
      })
      .catch((err) => console.log(err));
  };

  //update cart
  updateCart = (req, res, next) => {
    const { productId, quantity } = req.body;
    req.user
      .updateFromCart(productId, quantity)
      .then((result) => {
        res.status(200).send(result.cart);
      })
      .catch((err) => console.log(err));
  };
}

module.exports = new CartController();
