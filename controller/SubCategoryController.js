const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

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

module.exports = {
       getSubCats,
       getSubCatsByCatID,
}