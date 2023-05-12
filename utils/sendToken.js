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

  // sendResponse(res, 200, payload);
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      expire: Date.now() + 24 * 60 * 60,
    })
    .json(payload);
};

module.exports = sendToken;
