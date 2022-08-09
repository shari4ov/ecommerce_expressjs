const express = require('express');
const app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const port = 3000;
const productAPI = require('./controller/ProductController')
const altCategoryAPI = require("./controller/AltCategoryController");
const subCatAPI = require('./controller/SubCategoryController')
const categoryAPI = require('./controller/CategoryController')
const contactAPI = require('./controller/ContactController')
const aboutUsAPI  = require('./controller/AboutUsController');
const UserAPI = require('./controller/UserController');
var {body} = require('express-validator');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.get('/api/stroyka/get/products/all',productAPI.getProduct)
app.get('/api/stroyka/get/products/byId/:id',productAPI.getProductByID)
app.get('/api/stroyka/get/products/byCategory/:category',productAPI.getProductByCategory)
app.get('/api/stroyka/get/products/bySubCategory/:subCategory',productAPI.getProductBySubCategory)
app.get('/api/stroyka/get/products/byAltCategory/:altCategory',productAPI.getProductByAltCategory)

app.get('/api/stroyka/get/altcategories',altCategoryAPI.getAltCategories)
app.get('/api/stroyka/get/altcategoriesBySubCatID/:id',altCategoryAPI.getAltCategoriesBySubCategory)

app.get('/api/stroyka/get/subcategories',subCatAPI.getSubCats)
app.get('/api/stroyka/get/subcategoriesByCatID/:id',subCatAPI.getSubCatsByCatID)

app.get('/api/stroyka/get/categories',categoryAPI.getCategories)
app.get('/api/stroyka/get/about',aboutUsAPI.getAbout)


const validationRuleFilterProduct = (section_name) => {
       let section_tmp = []
       return [
              body(section_name).notEmpty().trim().escape().custom(value=> {
                     return (async () => {
                            await prisma.$connect();
                            var section__ = await prisma[section_name].findMany({
                                   select:{
                                          id:true
                                   }
                            })
                            section__.forEach(obj => {
                                   section_tmp.push(obj.id)
                               })
                            if(!section_tmp.includes(parseFloat(value))){
                                   throw new Error("Movcud deyil")
                            }
                     })()
              }),
              body("max_price").notEmpty().trim().escape(),
              body("min_price").notEmpty().trim().escape()
       ]
}
app.post('/api/stroyka/filter/product/subcategory',validationRuleFilterProduct("subcategory"),productAPI.filterPriceBySubCat)
app.post('/api/stroyka/filter/product/category',validationRuleFilterProduct("category"),productAPI.filterPriceByCategory)
app.post('/api/stroyka/filter/product/altcategory',validationRuleFilterProduct("altcategory"),productAPI.filterPriceByAltCat)
const validationRuleContact = () => {
       return [
              body('name').notEmpty().matches(/^[a-zA-Z\s]*$/).escape().trim().withMessage("Ad düzgün doldurulmayıb"),
              body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage("E-mail  düzgün doldurulmayıb"),
              body('phone').notEmpty().matches(/^[+]?[0-9]{3}?[(]?[0-9]{2}[)]?[0-9]{4,7}$/).escape().trim().withMessage("Nömrə düzgün doldurulmayıb"),
              body('message').notEmpty().escape().trim().withMessage("Məktub düzgün deyil")
       ]
}
app.post('/api/stroyka/contactus/',validationRuleContact(),contactAPI.postContact)

const validationRuleRegister = () => {
       return [
              body('name').notEmpty().matches(/^[a-zA-Z\s]*$/).escape().trim().withMessage("Ad düzgün doldurulmayıb"),
              body('lastname').notEmpty().matches(/^[a-zA-Z\s]*$/).escape().trim().withMessage("Soyad düzgün doldurulmayıb"),
              body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage("E-mail  düzgün doldurulmayıb").custom(value => {
                     return (async () => {
                            await prisma.$connect();
                            const user__ = await prisma.user.findUnique({
                                   where:{
                                          email: value
                                   }
                            })  
                            if(user__) {
                                   throw new Error("Email mövcuddur")
                            }
                     })()
              }),
              body('phone').notEmpty().matches(/^[+]?[0-9]{3}?[(]?[0-9]{2}[)]?[0-9]{4,7}$/).escape().trim().withMessage("Nömrə düzgün doldurulmayıb"),
              body('password').isLength({min:6}).escape().trim().withMessage("Şifrə düzgün doldurulmayıb"),
              body('adress').notEmpty().escape().trim()
       ]
}
app.post('/api/stroyka/register/user',validationRuleRegister(),UserAPI.UserRegister)
app.post('/api/stroyka/login/user',UserAPI.UserLogin)
module.exports=app.listen(port,() => {
       console.log('Listening');
})