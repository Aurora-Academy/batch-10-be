const router = require("express").Router();
const { secureAPI } = require("../../utils/secure");
const Controller = require("./room.controller");

// Public
router.get("/public", async (req, res, next) => {
  try {
    const result = await Controller.publicRooms();
    res.json({
      data: result,
      msg: "All available rooms are shown successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.get("/public/:number", async (req, res, next) => {
  try {
    const result = await Controller.publicRoomInfo(req.params.number);
    res.json({
      data: result,
      msg: "Room Info is shown successfully",
    });
  } catch (e) {
    next(e);
  }
});

// Admin
router.get("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const { name, page, limit, status } = req.query;
    const filter = { status };
    const search = { name };
    const result = await Controller.list({ filter, search, page, limit });
    res.json({
      data: result,
      msg: "Rooms list are shown successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.publicRooms(req.params.id);
    res.json({
      data: result,
      msg: "All available rooms are shown successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.post("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.create(req.body);
    res.json({
      data: result,
      msg: "New room is added successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.updateById(req.params.id, req.body);
    res.json({
      data: result,
      msg: "Room updated successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.updateStatus(req.params.id, req.body);
    res.json({
      data: result,
      msg: "Room status updated successfully",
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:number", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.remove(req.params.number);
    res.json({
      data: result,
      msg: "Room deleted successfully",
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
