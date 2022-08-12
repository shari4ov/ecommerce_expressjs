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
              let id = parseInt(req.params.id)
              await prisma.$connect;
              const subCategory = await prisma.subcategory.findMany({
                     where:{
                            category_id: id
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
                            name:req.body.name,
                            category_id:req.body.category_id
                     }
              })
              res.status(201).send("Created")
       } catch (e ) {
              console.log(e);
              res.status(500)
       }
}
module.exports = {
       getSubCats,
       getSubCatsByCatID,
       createNewSubCat
}