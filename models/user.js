const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        img: { type: String, required: true },
        nameProduct: { type: String, required: true },
        priceProduct: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  role: {
    type: String,
    required: true,
  },
});

userSchema.methods.addToCart = function (product, count) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  const updateCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    updateCartItems[cartProductIndex].quantity =
      this.cart.items[cartProductIndex].quantity + count;
  } else {
    updateCartItems.push({
      nameProduct: product.name,
      priceProduct: product.price,
      img: product.img1,
      productId: product._id,
      quantity: count,
    });
  }

  const updateCart = {
    items: updateCartItems,
  };
  this.cart = updateCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updateCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updateCartItems;
  return this.save();
};

userSchema.methods.updateFromCart = function (productId, quantity) {
  this.cart.items.map((item) => {
    if (item.productId.toString() === productId.toString()) {
      item.quantity = quantity;
    }
  });
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};
module.exports = mongoose.model("User", userSchema);
