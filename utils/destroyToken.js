const destroytoken = async (res) => {
  const token = await res.user.getJWTToken();
  payload = {
    success: true,
    message: "user logged out!!!",
    token,
  };
  sendResponse(res, 200, payload);
  // res.clearCookie("token").redirect("/login")
};

module.exports = destroytoken;
