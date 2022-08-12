const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const crypto = require("crypto");

const getAltCategories = async(req,res) => {
       try{ 
              await prisma.$connect;
              const category = await prisma.altcategory.findMany();
              res.status(200).json(category)
       } catch(err) {
              console.log(err);
              res.status(404).send("Invalid")
       }
}
const getAltCategoriesBySubCategory = async(req,res) => {
       try{ 
              let subCatId = parseInt(req.params.id)
              await prisma.$connect;
              const category = await prisma.altcategory.findMany({
                     where:{ 
                            subcat_id: subCatId
                     }
              });
              res.status(200).json(category)
       } catch(err) {
              console.log(err);
              res.status(404).send("Invalid")
       }
}
const createNewAltCat = async (req,res) => {
       try {
              await prisma.$connect;
              let uniq_id__tmp =crypto.randomBytes(8).toString("hex");
              const newAltCat = await prisma.altcategory.create({
                     data:{
                            uniq_id:uniq_id__tmp,
                            name: JSON.stringify(req.body.name),
                            cat_id: req.body.category_id,
                            subcat_id:req.body.subCategory_id
                     }
              })
              res.status(201).send("Created")
       } catch(e){ 
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports = {
       getAltCategories,
       getAltCategoriesBySubCategory,
       createNewAltCat
}