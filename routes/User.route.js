const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel } = require("../models/User.model");

userRouter.post("/register", (req, res) => {
  const { email, pass, name, gender } = req.body;

  try {
    bcrypt.hash(pass, 5, async (err, secure_password) => {
      if (secure_password) {
        const user = new UserModel({
          email,
          pass: secure_password,
          name,
          gender,
        });

        await user.save();
        res.status(200).send({ msg: "Registered" });
      } else if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    res.status(400).send({ msg: "Error in registering the user" });
    console.log(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.find({ email });
    const hashed_pass = user[0].pass;
    if (user.length > 0) {
      bcrypt.compare(pass, hashed_pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, process.env.key);
          res.status(200).send({ msg: "Login Successfull", "token": token });
        } else {
          res.status(400).send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.status(400).send({ msg: "No User Found " });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong" });
    console.log(error);
  }
});

module.exports = {
  userRouter
};
