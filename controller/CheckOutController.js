const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {validationResult} =require('express-validator')
const { v4: uuidv4 } = require('uuid');

const checkOut = async (req,res) => {
       try{ 
              
              try {
 
                     let uniq_id__tmp = uuidv4();
                     await prisma.$connect;
                     const checkout = await prisma.checkout.create({
                            data: {
                                   uniq_id:uniq_id__tmp,
                                   productCount: parseInt(req.body.count),
                                   orderAdress: JSON.stringify(req.body.adress),
                                   userId : req.body.userId,
                                   productId: req.body.productId
                            }
                     })
                     res.status(201).json("Successfuly created")
              } catch(e) {
                     console.log(e);
                     res.status(501);
              }

       } catch(e){
              console.log(e);
              res.status(500).send("Server error")
       }
}

module.exports = {
       checkOut
}






