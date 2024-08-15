const Model = require("./user.model");
const { genHash, compareHash } = require("../../utils/secure");
const { genOTP, genToken } = require("../../utils/token");
const { sendEmail } = require("../../services/mailer");

const create = (payload) => {};

const register = async (payload) => {
  const { password, roles, isActive, ...rest } = payload;
  // Check if user email already exists or not
  const userExist = await Model.findOne({ email: rest?.email });
  if (userExist) throw new Error("This email has already been taken");
  // hash the text password
  rest.password = genHash(password);
  // register the user into database
  const newUser = await Model.create(rest);
  if (!newUser) throw new Error("User registration failed. Try again later.");
  // generate the otp & update the user model with token
  const myToken = genOTP();
  await Model.updateOne({ email: newUser.email }, { token: myToken });
  // send otp through email
  const isEmailSent = await genEmailToken({
    to: newUser?.email,
    subject: "Welcome to XYZ hotel Mgmt",
    msg: `<h1>Your OTP code for email verification is ${myToken}</h1>`,
  });
  if (!isEmailSent) throw new Error("User email sending failed...");
  return { data: null, msg: "Please check your email for verification" };
};

const genEmailToken = async ({ to, subject, msg }) => {
  const { messageId } = await sendEmail({ to, subject, htmlMessage: msg });
  return messageId ? true : false;
};

const verifyEmailToken = async (payload) => {
  const { email, token } = payload;
  // email system check garnu paryo + user shouldn't be blocked
  const user = await Model.findOne({ email, isBlocked: false });
  if (!user) throw new Error("User not found");
  // compare user le pathayeko token with db store gareko token
  const isValidToken = token === user?.token;
  if (!isValidToken) throw new Error("Invalid token");
  // match vayo vane => isActive true & token empty gardine
  const updatedUser = await Model.updateOne(
    { email },
    { isActive: true, token: "" }
  );
  if (!updatedUser) throw new Error("Email verification failed"); // TODO fix minor issue
  return { data: null, msg: "Thank you for verifying your email" };
};

const login = async (payload) => {
  const { email, password } = payload;
  // user find using email + blocked  + active check
  const user = await Model.findOne({ email, isActive: true, isBlocked: false });
  if (!user) throw new Error("User not found");
  // compare password with db stored pw
  const isValidPw = compareHash(password, user?.password);
  if (!isValidPw) throw new Error("Username or Password didn't match");
  // gentoken return that token
  const data = {
    name: user?.name,
    email: user?.email,
    roles: user?.roles,
  };
  return genToken(data);
};

const genForgetPasswordToken = () => {};
const verifyForgetPasswordToken = () => {};
const changePassword = () => {};
const resetPassword = () => {};
const blockUser = () => {};
const list = () => {}; // Advanced DB Operations
const getById = () => {};
const updateProfile = () => {};

module.exports = {
  create,
  register,
  login,
  verifyEmailToken,
  genForgetPasswordToken,
  verifyForgetPasswordToken,
  changePassword,
  resetPassword,
  blockUser,
  list,
  getById,
  updateProfile,
};
