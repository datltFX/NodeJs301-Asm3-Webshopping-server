const Product = require("../models/product");

class ProductsController {
  //get all products (admin-clients)
  getProducts = (req, res, next) => {
    Product.find()
      .then((products) => {
        if (products.length === 0) {
          return res.status(404).send("No product found");
        } else {
          res.status(200).send(products);
        }
      })
      .catch((err) => console.log(err));
  };

  //get detail product
  getDetailProduct = async (req, res, next) => {
    const productId = req.params.prodId;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send("No product found");
      } else {
        res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get search prodcuts (admin)
  searchProduct = async (req, res, next) => {
    const query = req.body.query;
    try {
      const products = await Product.find();
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      res.status(200).send(results);
    } catch (err) {
      console.log(err);
    }
  };

  //post new product
  addProduct = async (req, res, next) => {
    // console.log(req.files);
    const { name, category, price, short_desc, long_desc, stock } = req.body;

    try {
      const images = req.files.map((file) => file.path);

      const newProduct = new Product({
        name: name,
        category: category,
        img1: images[0],
        img2: images[1],
        img3: images[2],
        img4: images[3],
        long_desc: long_desc,
        short_desc: short_desc,
        price: price,
        stock: stock,
      });
      await newProduct.save();
      res.status(200).json("Add product success!");
    } catch (err) {
      console.log(err);
    }
  };

  //put update product
  editProduct = async (req, res, next) => {
    const {
      name,
      category,
      price,
      short_desc,
      long_desc,
      stock,
      img1,
      img2,
      img3,
      img4,
    } = req.body;
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) return res.status(422).json("Not found this product!");

      let productUpdate;
      const images = req.files;
      if (images) {
        const updateImages = images.map((image) => {
          image.path;
        });
        productUpdate = {
          name: name,
          category: category,
          img1: updateImages[0],
          img2: updateImages[1],
          img3: updateImages[2],
          img4: updateImages[3],
          long_desc: long_desc,
          short_desc: short_desc,
          price: price,
          stock: stock,
        };
      } else {
        productUpdate = {
          name: name,
          category: category,
          img1: img1,
          img2: img2,
          img3: img3,
          img4: img4,
          long_desc: long_desc,
          short_desc: short_desc,
          price: price,
          stock: stock,
        };
      }

      await Product.findByIdAndUpdate(req.params.productId, productUpdate);

      res.status(200).json("Update product success!");
    } catch (err) {
      console.log(err);
    }
  };

  // delete product (admin)
  deleteProduct = async (req, res, next) => {
    try {
      // check product exists
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).send("Product not exists!");
      }
      // delete product
      await Product.findByIdAndDelete(req.params.productId);
      res.status(200).json(`Delete product ${req.params.productId} success!`);
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = new ProductsController();
