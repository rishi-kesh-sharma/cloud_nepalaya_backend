const sendResponse = require("./sendResponse");

// create token and saving in cookie
const sendToken = async (res) => {
  const token = await res.user.getJWTToken();
  res.user.authTokens.push(token);
  await res.user.save();
  const { password, ...others } = res.user._doc;
  payload = {
    success: true,
    message: "user logged in!!!",
    token,
    user: others,
  };

  sendResponse(res, 200, payload);
};

module.exports = sendToken;
