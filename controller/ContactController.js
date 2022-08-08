const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {validationResult} =require('express-validator')
const { v4: uuidv4 } = require('uuid');
const postContact = async (req,res,next) => {
       console.log(req.body);
       const errors  = validationResult(req)
       if(!errors.isEmpty()){
              return res.status(400).json({errors:errors.array()})
       }
       await prisma.$connect;
       let uniq_id__tmp = uuidv4();
       const contactForm = await prisma.contact.create({
              data: {
                     uniq_id:uniq_id__tmp,
                     email: req.body.email,
                     name: req.body.name,
                     phone:req.body.phone,
                     message: req.body.message
              }
       })
       res.status(201).json({msg: "Successfully submited"});
}

module.exports = {
       postContact
}