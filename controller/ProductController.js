const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const {validationResult} =require('express-validator')
const crypto = require("crypto");
var fs = require('fs');
const { json } = require("body-parser");
const { isAsyncFunction } = require("util/types");

const getProduct = async (req,res) => {
       try{
              // swagger.tags = ['Product']
              await prisma.$connect;
              const products = await prisma.product.findMany();
              res.status(200).json(products)
       } catch(e) {
              res.status(404).send("Invalid")
       }
}
const getProductByID = async (req,res) => {
       try {
              let search__ = JSON.stringify(req.params.slug)
              await prisma.$connect;
              const product  = await prisma.product.findUnique({
                     where:{
                            slug: search__
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
              const category_search = JSON.stringify(req.params.category);
              await prisma.$connect;
              const category__ = await prisma.category.findUnique({
                     where:{
                            slug:category_search
                     },
                     select:{
                            uniq_id:true
                     }
              })
              const products = await prisma.product.findMany({
                     where:{
                            cat_id:category__.uniq_id
                     },
                     include:{
                            category:true,
                            subcategory:true,
                            altcategory:true
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
              const subCategory_search = (req.params.subCategory);
              await prisma.$connect;
              const subcategory__ = await prisma.subcategory.findUnique({
                     where:{
                            slug:subCategory_search
                     },
                     select:{
                            uniq_id:true
                     }
              })
              const products = await prisma.product.findMany({
                     where:{
                            subcat_id:subcategory__.uniq_id
                     },
                     include:{
                            category:true,
                            subcategory:true,
                            altcategory:true
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
              const altCategory = JSON.stringify(req.params.altCategory);
              
              await prisma.$connect;
              const altcategory__ = await prisma.altcategory.findUnique({
                     where:{
                            slug:altCategory
                     },
                     select:{
                            uniq_id:true
                     }
              })
              const products = await prisma.product.findMany({
                     where:{
                            altcat_id:altcategory__.uniq_id
                     },
                     include:{
                            category:true,
                            subcategory:true,
                            altcategory:true
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
                     let subcategory = req.body.subcategory
                     let maxPrice = parseFloat(req.body.max_price);
                     let minPrice = parseFloat(req.body.min_price);
                     const productFilter = await prisma.product.findMany({
                            where:{
                                   subcat_id:subcategory,
                                   price:{
                                          gte:minPrice,
                                          lte:maxPrice
                                   }
                            }
                     })
                     console.log(productFilter);
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
                    
                     let altcategory = req.body.altcategory
                     let maxPrice = parseFloat(req.body.max_price);
                     let minPrice = parseFloat(req.body.min_price);
                     const productFilter = await prisma.product.findMany({
                            where:{
                                   altcat_id:altcategory,
                                   price:{
                                          gte:minPrice,
                                          lte:maxPrice
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
                     
                     let category = (req.body.category)
                     let maxPrice = parseFloat(req.body.max_price);
                     let minPrice = parseFloat(req.body.min_price);
                     const productFilter = await prisma.product.findMany({
                            where:{
                                   cat_id:category,
                                   price:{
                                          gte:minPrice,
                                          lte:maxPrice
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
              const requestLanguage = req.query.lang
              await prisma.$connect;
              try {
                     let productSearch='';
                     let productSearchCount='';
                     if(requestLanguage=='az') {
                            productSearch = await prisma.product.findMany({
                                   where:{
                                          name_az:{
                                                 contains:requestParam
                                          }
                                   }
                            })
                     } else if(requestLanguage=='en') {
                            productSearch = await prisma.product.findMany({
                                   where:{
                                          name_en:{
                                                 contains:requestParam
                                          }
                                   }
                            })
                     } else {
                            productSearch = await prisma.product.findMany({
                                   where:{
                                          name_ru:{
                                                 contains:requestParam
                                          }
                                   }
                            })
                     }
                    if(requestLanguage=='az'){
                            productSearchCount= await prisma.product.count({
                                   where:{
                                          name_az:{
                                                 contains:requestParam
                                          }
                                   }
                            })
                    } else if(requestLanguage=='en') {
                            productSearchCount= await prisma.product.count({
                                   where:{
                                          name_en:{
                                                 contains:requestParam
                                          }
                                   }
                            })
                    } else {
                     productSearchCount= await prisma.product.count({
                            where:{
                                   name_ru:{
                                          contains:requestParam
                                   }
                            }
                     })
                    }
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
              await prisma.$connect;
              let uniq_id__tmp =crypto.randomBytes(8).toString("hex");
              const newProduct = await prisma.product.create({
                     data :{ 
                            uniq_id:uniq_id__tmp,
                            name_az : (req.body.name_az),
                            name_ru : (req.body.name_ru),
                            name_en : (req.body.name_en),
                            slug:(req.body.slug),
                            description :(req.body.description),
                            specification :(req.body.specification),
                            price :parseFloat(req.body.price),
                            status : req.body.status,
                            weight :  parseFloat(req.body.weight),
                            model : req.body.model,
                            images : (images__tmp),
                            code : req.body.code,
                            type:(req.body.type),
                            manufacturer: (req.body.manufacturer),
                            isBestseller: Boolean(req.body.isBestseller),
                            isFeatured: Boolean(req.body.isFeatured),
                            altcat_id:(req.body.altcat_id),
                            subcat_id:(req.body.subcat_id),
                            cat_id:(req.body.cat_id)
                     }
              })
              console.log(newProduct);
              res.status(201).send("Successfully created");
       } catch(e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}

const deleteProduct = async (req,res) => {
       try {
              await prisma.$connect;
              const uniq_id__ = req.body.uniq_id;
              const deletedUser__Image = await prisma.product.findUnique({
                     where:{
                            uniq_id:uniq_id__
                     },
                     select:{
                            images:true
                     }
              })
              if(deletedUser__Image) {
                     JSON.parse(deletedUser__Image.images).forEach(item =>{ 
                            fs.unlink(`${item}`,function(err){
                                   if(err) throw err;
                                   console.log('File deleted');
                            })
                     })
                     let deletedProduct = await prisma.product.delete({
                            where:{
                                   uniq_id:uniq_id__
                            }
                     })
                   return res.status(200).send("Deleted")
              }
              return res.status(404)
       } catch(e){
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
       createNewProduct,
       deleteProduct
}