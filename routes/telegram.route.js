const {callback} = require('../controllers/telegramController')
const express = require("express");
const router = express.Router();

router.get("/callback", callback);

module.exports = router;