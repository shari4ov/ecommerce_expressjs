const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {validationResult} =require('express-validator')

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
const filterPriceBySubCat = async(req,res) => {
       try{
              await prisma.$connect;
              try{ 
                     const errors  = validationResult(req)
                     if(!errors.isEmpty()){
                            return res.status(400).json({errors:errors.array()})
                     }              
                     let subcategory = parseFloat(req.body.subcategory)
                     let maxPrice = parseFloat(req.body.max_price);
                     let minPrice = parseFloat(req.body.min_price);
                     const productFilter = await prisma.product.findMany({
                            where:{
                                   subcat_id:subcategory,
                                   price:{
                                          lte:minPrice,
                                          gte:maxPrice
                                   }
                            }
                     })
                     res.status(200).json({data:productFilter})
              }catch (e){
                     console.log(e);
                     res.status(500).json({msg:"Server error"})
              }
       } catch(e) {
              console.log(e);
              res.status(404).json({msg:"Invalid"})
       }
}
const filterPriceByAltCat = async(req,res) => {
       try{
              await prisma.$connect;
              try{ 
                     const errors  = validationResult(req)
                     if(!errors.isEmpty()){
                            return res.status(400).json({errors:errors.array()})
                     } 
                     let altcategory = parseFloat(req.body.altcategory)
                     let maxPrice = parseFloat(req.body.max_price);
                     let minPrice = parseFloat(req.body.min_price);
                     const productFilter = await prisma.product.findMany({
                            where:{
                                   altcat_id:altcategory,
                                   price:{
                                          lte:minPrice,
                                          gte:maxPrice
                                   }
                            }
                     })
                     res.status(200).json({data:productFilter})
              }catch (e){
                     console.log(e);
                     res.status(500).json({msg:"Server error"})
              }
       } catch(e) {
              console.log(e);
              res.status(404).json({msg:"Invalid"})
       }
}
const filterPriceByCategory = async(req,res) => {
       try{
              await prisma.$connect;
              try{ 
                     const errors  = validationResult(req)
                     if(!errors.isEmpty()){
                            return res.status(400).json({errors:errors.array()})
                     } 
                     let category = parseFloat(req.body.category)
                     let maxPrice = parseFloat(req.body.max_price);
                     let minPrice = parseFloat(req.body.min_price);
                     const productFilter = await prisma.product.findMany({
                            where:{
                                   cat_id:category,
                                   price:{
                                          lte:minPrice,
                                          gte:maxPrice
                                   }
                            }
                     })
                     res.status(200).json({data:productFilter})
              }catch (e){
                     console.log(e);
                     res.status(500).json({msg:"Server error"})
              }
       } catch(e) {
              console.log(e);
              res.status(404).json({msg:"Invalid"})
       }
}
module.exports = {
       getProduct,
       getProductByID,
       getProductByCategory,
       getProductBySubCategory,
       getProductByAltCategory,
       filterPriceBySubCat,
       filterPriceByAltCat,
       filterPriceByCategory
}