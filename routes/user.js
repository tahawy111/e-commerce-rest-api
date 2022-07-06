import cryptoJs from "crypto-js";
import express from "express";
import User from "../models/User.js";
const router = express.Router();

import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken.js";

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  console.log(req.user);
  if (req.body.password) {
    req.body.password = cryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all user

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 })
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
  //   try {
  //     const usersV1 = await User.find();
  //     const usersV2 = usersV1.map((user) => {
  //       const { password, ...others } = user._doc;
  //       return others;
  //     });
  //     res.status(200).json(usersV2);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
});

// Get User States

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 })
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
  //   try {
  //     const usersV1 = await User.find();
  //     const usersV2 = usersV1.map((user) => {
  //       const { password, ...others } = user._doc;
  //       return others;
  //     });
  //     res.status(200).json(usersV2);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
});

// get user stats

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
