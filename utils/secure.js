const bcrypt = require("bcryptjs");
const { verifyToken } = require("../utils/token");
const userModel = require("../modules/users/user.model");

const genHash = (text) => {
  return bcrypt.hashSync(text, Number(process.env.SALT_ROUND));
};

const compareHash = (text, hashText) => {
  return bcrypt.compareSync(text, hashText);
};

const secureAPI = (sysRole = []) => {
  return async (req, res, next) => {
    try {
      const { access_token } = req.headers;
      if (!access_token) throw new Error("Login Token not found");
      const { email } = verifyToken(access_token);
      const user = await userModel.findOne({
        email,
        isActive: true,
        isBlocked: false,
      });
      if (!user) throw new Error("User not found");
      const isValidRole = sysRole.some((role) => user?.roles.includes(role));
      if (!isValidRole) {
        throw new Error("User unauthorized");
      } else {
        req.body.updated_by = user?._id;
        next();
      }
    } catch (e) {
      next(e);
    }
  };
};

const checkUser = async (req, res, next) => {
  try {
    const me = req.body.updated_by;
    const user = await userModel.findOne({
      _id: me,
    });
    if (!user) throw new Error("User not found");
    const isAdmin = user?.roles.includes("admin");
    if (!isAdmin) {
      req.body.filter = {
        created_by: me,
      };
    }
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { checkUser, genHash, compareHash, secureAPI };
