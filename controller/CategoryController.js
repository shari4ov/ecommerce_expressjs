const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const crypto = require("crypto");
const getCategories = async (req,res) => {
       try{
              await prisma.$connect;
              const categories = await prisma.category.findMany({
                     include:{
                            subcategory: {
                                   include:{
                                          altcategory:true
                                   }
                            }
                     }
              });
              res.status(200).json(categories)
       } catch(e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}
const createNewCategory = async(req,res) => {
       try {
              await prisma.$connect;
              let uniq_id__tmp =crypto.randomBytes(8).toString("hex");
              const newCategory = await prisma.category.create({
                     data:{
                            uniq_id:uniq_id__tmp,
                            name: JSON.stringify(req.body.name)
                     }
              }) 
              res.status(201).send("Created")
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports = {
       getCategories,
       createNewCategory
}