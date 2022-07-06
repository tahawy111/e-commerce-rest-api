import user from "./user.js";
import product from "./product.js";
import cart from "./cart.js";
import order from "./order.js";
import auth from "./auth.js";

export default (app) => {
  app.use("/api/users", user);
  app.use("/api/orders", order);
  app.use("/api/products", product);
  app.use("/api/cart", cart);
  app.use("/api/auth", auth);
};
