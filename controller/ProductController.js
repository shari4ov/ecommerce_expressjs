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
              const category_search = parseInt(req.params.category);
              await prisma.$connect;
              const products = await prisma.product.findMany({
                    where:{
                     cat_id:category_search
                    }
              })
              res.status(200).json(products)
       } catch(e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}
const getProductBySubCategory = async (req,res) => {
       try{
              const subCategory = parseInt(req.params.subCategory);
              await prisma.$connect;
              const products = await prisma.product.findMany({
                     where:{
                            subcat_id:subCategory
                     }
              })
              res.status(200).json(products)
       }catch(e){
              console.log(e);
              res.status(404).send('invalid')
       }
}
const getProductByAltCategory = async (req,res) => {
       try{
              const altCategory = parseInt(req.params.altCategory);
              await prisma.$connect;
              const products = await prisma.product.findMany({
                     where:{
                            altcat_id:altCategory
                     }
              })
              res.status(200).json(products)
       }catch(e){
              console.log(e);
              res.status(404).send('invalid')
       }
}
module.exports = {
       getProduct,
       getProductByID,
       getProductByCategory,
       getProductBySubCategory,
       getProductByAltCategory
}