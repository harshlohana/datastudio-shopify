const express = require("express");
const server = express();
const shopifyRouter = express.Router();
const passport = require("passport");
const shopifyController = require("../controllers/shopifyController");

shopifyRouter.get("/new", shopifyController.validateMerchantShopify);
shopifyRouter.get("/callback",passport.authenticate("shopify", {
successRedirect: "/dashboard",
failureRedirect: "/",
}),shopifyController.validateMerchantShopifyCallback);
shopifyRouter.get("/logout", shopifyController.destroySession);
shopifyRouter.get("/details", shopifyController.startupDetails);


module.exports = shopifyRouter;