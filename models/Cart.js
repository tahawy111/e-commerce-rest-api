import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    product: {
      type: [
        {
          productId: { type: String, required: true },
          quantity: { type: Number, required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('user', productSchema);
