const express = require('express');
const webhookController = require('../controllers/webhookController');
const server = express();
const webhookRouter = express.Router();

webhookRouter.post("/register",webhookController.registerOrderCreateWebhook);

module.exports = webhookRouter;