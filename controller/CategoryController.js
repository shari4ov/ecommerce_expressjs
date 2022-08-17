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
                            name_az: (req.body.name_az),
                            name_ru: (req.body.name_ru),
                            name_en: (req.body.name_en),
                            slug:(req.body.slug)
                     }
              }) 
              res.status(201).send("Created")
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}

const deleteCategory = async (req,res) => {
       try{ 
               await prisma.$connect;

               let uniq_id__ = req.body.uniq_id;

               const deleteCategory = await prisma.category.delete({
                     where:{
                            uniq_id:uniq_id__
                     }
               })
               res.status(200).json("Deleted")
       } catch(e){
              console.log(e);
              res.status(501).send("Invalid")
       }
}
module.exports = {
       getCategories,
       createNewCategory,
       deleteCategory
}