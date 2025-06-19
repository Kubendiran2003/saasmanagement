const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    client: req.params.clientId,
    user: req.user,
  });
  res.json(product);
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({
    client: req.params.clientId,
    user: req.user,
  });
  res.json(products);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findOneAndDelete({ _id: req.params.id, user: req.user });
  res.json({ message: "Product deleted" });
};
