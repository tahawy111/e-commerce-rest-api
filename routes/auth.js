import express from "express";
const router = express.Router();
import User from "../models/User.js";
import cryptoJs from "crypto-js";
import jwt from "jsonwebtoken";

// register

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const user = await newUser.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials!");

    const hashedPassword = cryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const Originalpassword = hashedPassword.toString(cryptoJs.enc.Utf8);

    Originalpassword !== req.body.password &&
      res.status(401).json("Password incorrect");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "30d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
