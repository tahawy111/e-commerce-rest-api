import express from "express";
import Product from "../models/Product.js";
import { verifyTokenAndAdmin } from "./verifyToken.js";
const router = express.Router();

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();

    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get Products

router.get("/find/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all products

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // Get User States

// router.get("/", verifyTokenAndAdmin, async (req, res) => {
//   const query = req.query.new;
//   try {
//     const users = query
//       ? await User.find().sort({ _id: -1 })
//       : await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json(err);
//   }
//   //   try {
//   //     const usersV1 = await User.find();
//   //     const usersV2 = usersV1.map((user) => {
//   //       const { password, ...others } = user._doc;
//   //       return others;
//   //     });
//   //     res.status(200).json(usersV2);
//   //   } catch (err) {
//   //     res.status(500).json(err);
//   //   }
// });

// // get user stats

// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear - 1));

//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastYear } } },
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//       { $group: { _id: "$month", total: { $sum: 1 } } },
//     ]);

//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

export default router;
