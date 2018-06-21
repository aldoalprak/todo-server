var express = require('express');
var router = express.Router();
const User = require("../controllers/users_controller.js")

/* GET users listing. */
router.post('/signup', User.signUp)
router.get('/show', User.show)
router.put('/update/:id', User.update)
router.delete('/delete/:id',User.delete)
router.post('/signin', User.signIn)


module.exports = router;
