const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users.model");
const isAuth = require("../middlewares/isAuth.middleaware");


require("dotenv").config();

const authRouter = Router();



authRouter.post('/sign-up', async (req, res) =>{
    const {fullName, email, password} = req.body
    if(!fullName || !email || !password) return res.status(400).json({message: "wrong params"})

    const existUser = await usersModel.findOne({email})
    if(existUser) return res.status(400).json({message: "user already exists"})

    const hashedPassword = await bcrypt.hash(password, 10)

    await usersModel.create({fullName, email, password: hashedPassword})
    res.status(201).json({message: "user created successfully"})
})
authRouter.post('/sign-in', async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) return res.status(400).json({message: "email or password is required"})

    const existUser = await usersModel.findOne({email})
    if(!existUser) return res.status(400).json({message: "email or password is incorect"})

    const isPasswordEqual = await bcrypt.compare(password, existUser.password)
    if(!isPasswordEqual) return res.status(400).json({message: "email or password is incorect"})

    const payLoad = {
        userId: existUser._id
    }

    const token = jwt.sign(payLoad, process.env.JWT_SECRET, {expiresIn: '1h'})
    res.json({token})
})


authRouter.get('/current-user', isAuth ,async (req, res) => {
    const user = await usersModel.findById(req.userId)
    res.json(user)
})


module.exports = authRouter;
