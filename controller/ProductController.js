const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {validationResult} =require('express-validator')
const crypto = require("crypto");


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
              let search_id = (req.params.id)
              await prisma.$connect;
              const product  = await prisma.product.findUnique({
                     where:{
                            uniq_id: search_id
                     },
                     include:{
                            category:true,
                            subcategory:true,
                            altcategory:true
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
const liveSearchProduct = async (req,res) => {
       try {
              const requestParam = req.query.search;
              console.log(requestParam);
              await prisma.$connect;
              try {
                     const productSearch = await prisma.product.findMany({
                            where:{
                                   name:{
                                          contains:requestParam
                                   }
                            }
                     })
                     const productSearchCount = await prisma.product.count({
                            where:{
                                   name:{
                                          contains:requestParam
                                   }
                            }
                     })
                     res.status(200).json({count:productSearchCount,data:productSearch})
              }catch(e) {
                     console.log(e);
                     res.status(500).json({msg: "Server error"})
              }

       }  catch(e) {
              console.log(e);
              res.status(404).json({msg:"Invalid"})
       }
}
const createNewProduct = async (req,res)=>{
       try{
              let images__tmp = [];
              req.files.forEach(item => {
                     images__tmp.push(item.path)
              })
              console.log(req.files);
              await prisma.$connect;
              let uniq_id__tmp =crypto.randomBytes(8).toString("hex");
              const newProduct = await prisma.product.create({
                     data :{ 
                            uniq_id:uniq_id__tmp,
                            name : JSON.stringify(req.body.name),
                            description : JSON.stringify(req.body.description),
                            specification :JSON.stringify(req.body.specification),
                            price :parseFloat(req.body.price),
                            status : req.body.status,
                            weight :  parseFloat(req.body.weight),
                            model : req.body.model,
                            images : JSON.stringify(images__tmp),
                            code : req.body.code,
                            isBestseller: Boolean(req.body.isBestseller),
                            isFeatured: Boolean(req.body.isFeatured),
                            altcat_id:req.body.altcat_id,
                            subcat_id:req.body.subcat_id,
                            cat_id:req.body.cat_id
                     }
              })
              res.status(201).send("Successfully created");
       } catch(e) {
              console.log(e);
              res.status(500).send("Invalid")
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
       filterPriceByCategory,
       liveSearchProduct,
       createNewProduct
}