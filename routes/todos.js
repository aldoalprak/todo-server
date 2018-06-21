const express = require('express')
const router = express.Router()
const Todo = require("../controllers/todos_controller.js")

router.post('/add',Todo.add)
router.get('/show',Todo.show)
router.put('/update/:id',Todo.update)
router.delete('/delete/:id', Todo.delete)

module.exports = router
