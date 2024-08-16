const multer = require("multer");
const router = require("express").Router();
const Controller = require("./user.controller");
const { validate, forgetPasswordValidation } = require("./user.validation");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "." + file?.originalname.split(".")[1]);
  },
});

const upload = multer({ storage }); // multer(opts)

router.post("/login", validate, async (req, res, next) => {
  try {
    const result = await Controller.login(req.body);
    res.json({ data: result, msg: "User logged in successfully" });
  } catch (e) {
    next(e);
  }
});

router.post("/register", upload.single("image"), async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }
    const result = await Controller.register(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/verify-email", async (req, res, next) => {
  try {
    const result = await Controller.verifyEmailToken(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/generate-fp-token", async (req, res, next) => {
  try {
    const result = await Controller.genForgetPasswordToken(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post(
  "/verify-fp-token",
  forgetPasswordValidation,
  async (req, res, next) => {
    try {
      const result = await Controller.verifyForgetPasswordToken(req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.put("/change-password", async (req, res, next) => {
  try {
    const result = await Controller.changePassword(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.put("/reset-password", async (req, res, next) => {
  try {
    const result = await Controller.resetPassword(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.patch("/block", async (req, res, next) => {
  try {
    const result = await Controller.blockUser(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
