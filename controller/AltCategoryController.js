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
              let subCatSlug = (req.params.slug)
              await prisma.$connect;
              const subCategory__ = await prisma.subcategory.findUnique({
                     where :{
                            slug:subCatSlug
                     },
                     select:{
                            uniq_id:true
                     }
              })
              const altCategory = await prisma.altcategory.findMany({
                     where:{ 
                            subcat_id: subCategory__
                     }
              });
              res.status(200).json(altCategory)
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
                            name_az: JSON.stringify(req.body.name_az),
                            name_ru: JSON.stringify(req.body.name_ru),
                            name_en: JSON.stringify(req.body.name_en),
                            slug: JSON.stringify(req.body.slug),
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
const deleteAltCategory = async (req,res) =>{ 
       try{
              await prisma.$connect;
              let uniq_id__ = req.body.uniq_id;
              let deletedAltCat = await prisma.altcategory.delete({
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
       getAltCategories,
       getAltCategoriesBySubCategory,
       createNewAltCat,
       deleteAltCategory
}