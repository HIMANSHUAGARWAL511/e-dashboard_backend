const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');

dotenv.config();

const jwt = require('jsonwebtoken')
// const http = require('http');
// const User = require("./db/User");
// require("./db/config")
const mongoose = require('mongoose')
const app = express();
const Database = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5000
const connectDB = async () => {
  await mongoose
    .connect(Database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Mongodb Connected")
    })
    .catch((err) => { console.log("Mongo Error" + err) });

  /***********************************************User Detail**************************** */

  const productSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  });
  const product = mongoose.model('users', productSchema);
  const data = await product.find();
  console.warn(data);

  app.use(express.json());
  app.use(cors());
  app.post('/register', async (req, res) => {
    let user = new product(req.body);
    let result = await user.save()
    result = result.toObject();
    delete result.password;
    res.send(result);

  });

  app.post('/login', async (req, res) => {

    if (req.body.password && req.body.email) {
      let User = await product.findOne(req.body).select("-password");
      if (User) {
        res.send(User)
      }
      else {
        res.send({ result: "No data Found" })
      }
    } else {
      res.send({ result: "No data Found" })
    }

  })

  /***********************************Product Details********************** */

  const userSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    userId: String,
    company: String
  })
  const productModel = mongoose.model('products', userSchema);
  const productsData = await productModel.find();
  console.log(productsData);

  app.post('/add-product', async (req, res) => {
    let userProduct = new productModel(req.body);
    let result1 = await userProduct.save();
    res.send(result1);
  });

  app.get('/product-list', async (req, res) => {
    let productList = await productModel.find().select('-userId');
    console.warn(productList)
    if (productList.length > 0) {
      res.send(productList);
    }
    else {
      res.send({ "result": "No Data found" })

    }
  });

  app.delete('/product/:id', async (req, res) => {
    let result = await productModel.deleteOne({ _id: req.params.id });
    res.send(result)
  })
  app.get('/product/:id', async (req, res) => {
    let result = await productModel.findOne({ _id: req.params.id });
    res.send(result)
  });

  app.put('/product/:id', async (req, res) => {
    let result = await productModel.updateOne(
      {
        _id: req.params.id
      }, {
      $set: req.body
    })
    res.send(result)
  });

  /**************************Search Api******************************** */

  app.get('/search/:key', async (req, res) => {
    let result = await productModel.find({
      "$or": [
        {
          name: { $regex: req.params.key }
        },
        { price: { $regex: req.params.key } },
        { category: { $regex: req.params.key } },
        { company: { $regex: req.params.key } }
      ]
    })
    res.send(result)
  })
  /**************************************JWT Token*********************************/

  app.listen(PORT)
}
connectDB();
