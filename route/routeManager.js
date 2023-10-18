const NewsRoute = require("./newsRoute");
const AuthRoute = require("./authRoute");
const AccountRoute = require("./accountRoute");

module.exports = function (app) {
  app.use("/", NewsRoute);
  app.use("/", AuthRoute);
  app.use("/", AccountRoute);
};
