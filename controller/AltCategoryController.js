const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

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
module.exports = {
       getAltCategories,
       getAltCategoriesBySubCategory
}