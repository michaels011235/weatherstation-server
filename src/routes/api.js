const express = require('express');
const router = express.Router();

router.get('/data', function(req, res) {
  res.json({'data': req.app.locals.counter});
});

module.exports = router;