const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getProduct = async (req,res) => {
       try{
              await prisma.$connect;
              const products = await prisma.product.findMany();
              res.status(200).json(products)
       } catch(e) {
              res.status(404).send("Invalid")
       }
}
const getProductByID = async (req,res) => {
       try {
              let search_id = req.params.id
              await prisma.$connect;
              const product  = await prisma.product.findOne({
                     where:{
                            id: search_id
                     }
              })
              res.status(200).json(product)
       } catch(e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}
const getProductByCategory = async (req,res) => {
       try{
              const category_search = req.params.category;
              await prisma.$connect;
              const products = await prisma.product.findMany({
                     include:{
                            altcategory: {
                                   include: {
                                          subcategory:true
                                   }
                            }
                     }
              })
              console.log(products);
              res.status(200).json(JSON.stringify(products))
       } catch(e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}

module.exports = {
       getProduct,
       getProductByID,
       getProductByCategory
}