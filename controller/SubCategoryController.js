const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const crypto = require("crypto");
const getSubCats = async(req,res) => {
       try{ 
              await prisma.$connect;
              const subCategory = await prisma.subcategory.findMany({
                     include:{
                            altcategory:true
                     }
              });
              res.status(200).json(subCategory)
       } catch(e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}
const getSubCatsByCatID = async(req,res) => {
       try{ 
              let category__ = JSON.stringify(req.params.slug);
              await prisma.$connect;
              const category_id = await prisma.category.findUnique({
                     where:{
                            slug:category__
                     },
                     select:{
                            uniq_id:true
                     }
              })
              const subCategory = await prisma.subcategory.findMany({
                     where:{
                            category_id: category_id.uniq_id
                     }
              });
              res.status(200).json(subCategory)
       } catch(e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}
const createNewSubCat = async (req,res) => {
       try{ 
              await prisma.$connect;
              let uniq_id__tmp =crypto.randomBytes(8).toString("hex");
              const newSubCat = await prisma.subcategory.create({
                     data:{
                            uniq_id:uniq_id__tmp,
                            name_az:req.body.name_az,
                            name_ru:req.body.name_ru,
                            name_en:req.body.name_en,
                            slug:req.body.slug,
                            category_id:req.body.category_id
                     }
              })
              res.status(201).send("Created")
       } catch (e ) {
              console.log(e);
              res.status(500)
       }
}
const deleteSubCategory = async (req,res) => {
       try{
              await prisma.$connect;
              const uniq_id__ = req.body.uniq_id;
              const deleteSubCat = await prisma.subcategory.delete({
                     where:{
                            uniq_id:uniq_id__
                     }
              })
              res.status(200).send("Deleted")
       } catch(e){
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports = {
       getSubCats,
       getSubCatsByCatID,
       createNewSubCat,
       deleteSubCategory
}