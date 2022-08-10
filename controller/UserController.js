const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {validationResult} =require('express-validator')
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
process.env.TOKEN_SECRET;

const UserRegister = async (req,res) => {
       try {
              const errors  = validationResult(req)
              if(!errors.isEmpty()){
                     return res.status(400).json({errors:errors.array()})
              }
              await prisma.$connect;
              try {
                     let password_hash = await bcrypt.hash(req.body.password,10)
                     let uniq_id__tmp = uuidv4();
                     const User = await prisma.user.create({
                           data:{
                                   uniq_id:uniq_id__tmp,
                                   name : JSON.stringify(req.body.name),
                                   lastname:JSON.stringify(req.body.lastname),
                                   phone: JSON.stringify(req.body.phone),
                                   password:password_hash,
                                   email: JSON.stringify(req.body.email),
                                   adress: JSON.stringify(req.body.adress),
                           }
                     })
                     res.status(201).json({msg:"Successfuly created"});
              }catch(e) {
                     console.log(e);
                     res.status(501).json({msg:"Server Error"})
              }
       } catch(e) {
              console.log(e);
              res.status(500).json({msg:"Invalid"})
       }
}
const UserLogin = async (req,res,next) => {
       try {
              const errors  = validationResult(req)
              if(!errors.isEmpty()){
                     return res.status(400).json({errors:errors.array()})
              }
              await prisma.$connect;
              try{
                     const user = await prisma.user.findUnique({
                            where:{
                                   email: req.body.email
                            }
                     })
                     if(!user) {
                          return res.status(422).json({msg:"Email mövcud deyil"})
                     }
                     const checkPassword = bcrypt.compareSync(req.body.password,user.password)
                     if(!checkPassword) return res.status(422).json({msg:"Şifrə düzgün deyil"})
                     const token = jwt.sign({
                            id:user.uniq_id,name:user.name,
                            lastname:user.lastname,
                            phone:user.phone,
                            email:user.email,
                            adress:user.adress       
                     },process.env.TOKEN_SECRET,{expiresIn:'24h'})
                     res.status(200).json(token)
              }catch(e) {
                     console.log(e);
                     res.status(500).json({msg: "Server error"})
              }

       } catch(e) {
              console.log(e);
              res.status(500).json({msg:"Invalid"})
       }
}
const UserLogout =  (req,res) => {
       try{ 
              const token =  jwt.sign({},process.env.TOKEN_SECRET,{expiresIn:'12'})
              res.status(200).json('logout')
       } catch(e) {
              console.log(e);
              res.status(404).json({msg:"Invalid"})
       }
}
module.exports= { 
       UserRegister,
       UserLogin,
       UserLogout
}