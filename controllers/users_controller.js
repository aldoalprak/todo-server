const UserModel = require("../models/user.js")
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');


class User {

	static signUp(req,res) {
		var dataInputUser = {
			password: req.body.password,
			email: req.body.email,
			username: req.body.username	
		}
		var hash = bcrypt.hashSync(req.body.password, 10);
		dataInputUser.password = hash

		UserModel.create(dataInputUser)
		.then(dataUser=>{
			res.status(200).json({message:"signup succeed",dataUser})
		})
		.catch(err=>{
			res.status(400).json({message:err.message})
		})	
				
		
	}

	static show(req,res) {
		UserModel.find()
		.populate('todoId','task_name')
		.exec(function(err,dataUsers){
			if(err) {
				res.status(400).json({message:err.message})	
			}else{
				res.status(200).send(dataUsers)	
			}
		})
	}

	static update(req,res) {
		bcrypt.hash(req.body.password,10,function(err,hash) {
			req.body.password = hash
			UserModel.findByIdAndUpdate(req.params.id,{$set: req.body})
				.then(dataUser=>{
					if(dataUser !== null) {
						res.status(200).send(dataUser)	
					}else{
						res.json({message:"id not found"})
					}
				})
				.catch(err=>{
					res.json({message:err.message})
				})
		})
	}

	static delete(req,res) {
		UserModel.findByIdAndDelete(req.params.id)
		.then(dataUser=>{
			if(dataUser !== null) {
				res.status(200).send(dataUser)	
			}else{
				res.json({message:"id not found"})
			}
		})
		.catch(err=>{
			res.json({message:err.message})
		})
	}

	static signIn(req,res) {
		UserModel.findOne({email:req.body.email})
		.then(dataUser=>{
			if(dataUser !== null) {
				if(req.body.password!== undefined) {
					bcrypt.compare(req.body.password,dataUser.password,function(err,response) {
						if(response) {
							var token = jwt.sign({ userId: dataUser._id }, process.env.JWT_SALT);
							res.status(200).json({message:"signin succeed",token})
						}else{
							res.status(400).json({message:"incorrect password/username"})	
						}
					})
				}else{
					var token = jwt.sign({ userId: dataUser._id }, process.env.JWT_SALT)
					res.status(200).json({message:"signin succeed",token})
				}	
			}else{
				if(req.body.password == undefined) {
					var dataInputUser = {
						password: req.body.userId,
						email: req.body.email,
						username: req.body.username	
					}
					var hash = bcrypt.hashSync(req.body.userId, 10);
					dataInputUser.password = hash

					UserModel.create(dataInputUser)
					.then(dataUser=>{
						var token = jwt.sign({ userId: dataUser._id }, process.env.JWT_SALT)
						res.status(200).json({message:"signin succeed",token})
					})
					.catch(err=>{
						res.status(400).json({message:err.message})
					})	
				}else{
					res.status(400).json({message:"incorrect password/username"})
				}
			}
			
		})
		.catch(err=>{
			console.log("masukk")
			res.status(500).json({message:err.message})
		})
	}
}

module.exports = User