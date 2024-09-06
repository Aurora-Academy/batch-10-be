const router = require("express").Router();
const { checkUser, secureAPI } = require("../../utils/secure");
const Controller = require("./order.controller");

router.get("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const { number, page, limit, status } = req.query;
    const filter = { status };
    const search = { number };
    const result = await Controller.list({ filter, search, page, limit });
    res.json({
      data: result,
      msg: "Orders list are shown successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.get(
  "/:orderNo",
  secureAPI(["admin", "user"]),
  checkUser,
  async (req, res, next) => {
    try {
      const filter = req.body.filter ?? null;
      const result = await Controller.getByOrderNumber(
        req.params.orderNo,
        filter
      );
      res.json({
        data: result,
        msg: "All available Orders are shown successfully",
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post("/", secureAPI(["admin", "user"]), async (req, res, next) => {
  try {
    const result = await Controller.create(req.body);
    res.json({
      data: result,
      msg: "New order is created successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.updateOrder(req.params.id, req.body);
    res.json({
      data: result,
      msg: "Order updated successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.updateOrderStatus(req.params.id, req.body);
    res.json({
      data: result,
      msg: "Order status updated successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:number", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.removeOrder(req.params.number);
    res.json({
      data: result,
      msg: "Order deleted successfully",
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
