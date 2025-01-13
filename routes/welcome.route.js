const express = require('express');
const router = express.Router();
const timeLog = (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  }
router.use(timeLog)
router.get('/',(req,res) => {
    res.json({ success: true, message: 'Welcome to the Unit API' });
} );

module.exports = router;