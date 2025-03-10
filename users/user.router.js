const {Router} = require ('express')
const { isValidObjectId } = require("mongoose");
const usersModel = require('../models/users.model');

const userRouter = Router()


userRouter.get("/",async(req,res)=>{
    const users  = await usersModel.find().populate('posts','title content').select('-password')
    res.json(users)
})

userRouter.get("/:id",async(req,res)=>{
    const {id} = req.params
    if(!isValidObjectId(id)) return res.status(400).json({message:"wrong id format"})
   
    const user = await usersModel.findById(id).select("-password")
    if(!user) return res.status(404).json({message: 'user not found'})
    res.json(user)
})


userRouter.delete("/:id",async(req,res) =>{
    const {id} = req.params
    if(!isValidObjectId(id)) return res.status(400).json({message:"wrong id format"})
     
    const user = await usersModel.findByIdAndDelete(id)
    if(!user) return res.status(400).json({message:"user not deleted"})    
    res.json({message:"user deleted succsessfully",data:user})
})

userRouter.put("/:id",async(req,res)=>{
    const {id} = req.params
    if(!isValidObjectId(id)) return res.status(400).json({message:"wrong id format"})
      
     const {fullName,email} = req.body
     const updateRequest = {}
     
     if(fullName) updateRequest.fullName = fullName
     if(email) updateRequest.email = email

     const user = await usersModel.findByIdAndUpdate(id,updateRequest,{new:true})
     if(!user) return res.status(400).json({message:"user not updated"})
    res.json({message:"user updated succsesffully",data:user})
})

// userRouter.post("/comment", async(req,res) => {
//     const {id} = req.params
//     if(!isValidObjectId(id)) return res.status(400).json({messsage:"wrong id format"})

//     const {comment} = req.body    
//     if(!comment) return res.status(400).json({message:"invalid params"})

//      const newComment = ({
//       comment
//      }) 
// })

module.exports = userRouter
