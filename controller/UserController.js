const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {validationResult} =require('express-validator')
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { checkOut } = require("./CheckOutController");

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
                                   name : (req.body.name),
                                   lastname:(req.body.lastname),
                                   phone: (req.body.phone),
                                   password:password_hash,
                                   email: (req.body.email),
                                   adress: (req.body.adress),
                           }
                     })
                     const token = jwt.sign({
                            id:uniq_id__tmp,
                            lastname:req.body.name,
                            phone:req.body.phone,
                            email:req.body.email,
                            adress:req.body.adress,
                     },process.env.TOKEN_SECRET,{expiresIn:'24h'})
                     res.status(201).json({msg:"Successfuly created",token:token});
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
              await prisma.$connect;
              try{
                     const user = await prisma.user.findUnique({
                            where:{
                                   email: (req.body.email)
                            },
                            include:{
                                   checkout:true
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
                            adress:user.adress,
                            checkout:user.checkout
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
const UserLogout =  async (req,res) => {
       try{ 
              const authHeader = req.get('authorization')
              const token = authHeader && authHeader.split(' ')[1]
              const token__ = jwt.sign({},token,{expiresIn:'1'})
              res.status(200).json('logout')
       } catch(e) {
              console.log(e);
              res.status(404).json({msg:"Invalid"})
       }
       
}
const UserChangePass = async (req,res) => {
       try{ 
              let user_uniq_id = req.body.uniq_id;
              let user_email = req.body.email;
              let user_pass = req.body.password; 
              try{
                     await prisma.$connect;
                     const user__ = await prisma.user.findUniqueOrThrow({
                            where:{
                                   uniq_id:user_uniq_id
                            }
                     })
                     if(user__.email == user_email) {
                            let password_hash = await bcrypt.hash(user_pass,10)
                            const updatedUser = await prisma.user.update({
                                   where:{
                                          email:user_email
                                   },
                                   data:{
                                          password: password_hash
                                   }
                            })
                            res.status(202).send("Updated");
                     }
                     res.status(404)
              } catch(e){
                     console.log(e);
                     res.status(501)
              }

       } catch(e){
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const UserList = async (req,res) =>{ 
      try {
             try {
                     await prisma.$connect;
                     const users = await prisma.user.findMany();
                     res.status(200).json(users)
              }catch(e){
                     console.log(e);
                     res.status(501)
              }
       }catch(e){
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports= { 
       UserRegister,
       UserLogin,
       UserLogout,
       UserList,
       UserChangePass 
}