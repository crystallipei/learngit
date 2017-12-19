var express = require('express');
var router = express.Router();


router.get('/*', function(req, res, next) {
    //console.log(req.url);
    next();
});
module.exports = router;