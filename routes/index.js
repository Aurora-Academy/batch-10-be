const router = require("express").Router();

const orderRouter = require("../modules/orders/order.route");
const roomRouter = require("../modules/rooms/room.route");
const userRouter = require("../modules/users/user.route");

router.get("/ping", (req, res) => {
  res.json({ ping: "pong" });
});

router.use("/api/v1/orders", orderRouter);
router.use("/api/v1/rooms", roomRouter);
router.use("/api/v1/users", userRouter);

module.exports = router;
