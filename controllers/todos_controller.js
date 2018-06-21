const TodoModel = require("../models/todo.js")
const UserModel = require("../models/user.js")
var jwt = require('jsonwebtoken')


class Todo {

	static add(req,res) {
		var decoded = jwt.verify(req.headers.token,process.env.JWT_SALT)
		var dataTodo = {
			task_name : req.body.task_name,
			description : req.body.description,
		}
		dataTodo.userId = decoded.userId
		TodoModel.create(dataTodo)
		.then(dataTodo=>{
			UserModel.findOne({_id: decoded.userId})
			.then(dataUser=>{
				dataUser.todoId.push(dataTodo._id)
				dataUser.save()
			})
			.catch(err=>{
				res.json({message:err.message})
			})

			res.status(200).json({message:"task created and pushed"})
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})
	}

	static show(req,res) {
		var decoded = jwt.verify(req.headers.token,process.env.JWT_SALT)
		TodoModel.find({ userId : decoded.userId})
		.populate('userId','username')
		.exec(function(err,dataTodos) {
			if(err) {
				res.status(400).json({message:err.message})	
			}else{
				res.status(200).send(dataTodos)	
			}
		})
	}

	static update(req,res) {
		var decoded = jwt.verify(req.headers.token,process.env.JWT_SALT)
		TodoModel.findById(req.params.id)
		.then(dataTodo=>{
			if(dataTodo !== null) {
				if(dataTodo.userId == decoded.userId) {
					TodoModel.update({$set: req.body})
					.then(result=>{
						res.status(200).json({message:"todo updated",result})	
					})
					.catch(err=>{
						res.send(err.message)
					})	
				}else{
					res.json({message:"you don't have authorized to edit this todo!!!"})
				}
					
			}else{
				res.status(300).json({message:"id not found"})
			}
			
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})
	}

	static delete(req,res) {
		var decoded = jwt.verify(req.headers.token,process.env.JWT_SALT)
		TodoModel.findById(req.params.id)
		.then(dataTodo=>{
			if(dataTodo !== null) {
				if(dataTodo.userId == decoded.userId) {
					TodoModel.deleteOne({_id:req.params.id})
					.then(result=>{
						res.status(200).json({message:"todo deleted",result})	
					})
						
				}else{
					res.json({message:"you don't have authorized to delete this todo"})
				}
					
			}else{
				res.status(300).json({message:"id not found"})
			}
				
			
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})
	}
	
}

module.exports = Todo