const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const todoSchema = new Schema({
	task_name:{
		type: String,
		required: true
	}, 
	description:{
		type:  String
	},
	status:{
		type: Boolean,
		default: false	
	},	
	userId:{type: ObjectId, ref: 'User' }
},{timestamps:true})

const TodoModel = mongoose.model('Todo',todoSchema)

module.exports = TodoModel