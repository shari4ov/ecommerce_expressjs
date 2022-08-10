const express = require('express');
const app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
const middlewares_validation = require('./middlewares/validation')
const middlewares_auth = require('./middlewares/jwt_auth');
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
app.get('/api/stroyka/get/products/all',middlewares_auth.authenticateToken,(req,res,next)=>{next()},productAPI.getProduct)
app.get('/api/stroyka/get/products/byId/:id',middlewares_auth.authenticateToken,(req,res,next)=>{next()},productAPI.getProductByID)
app.get('/api/stroyka/get/products/byCategory/:category',middlewares_auth.authenticateToken,(req,res,next)=>{next()},productAPI.getProductByCategory)
app.get('/api/stroyka/get/products/bySubCategory/:subCategory',middlewares_auth.authenticateToken,(req,res,next)=>{next()},productAPI.getProductBySubCategory)
app.get('/api/stroyka/get/products/byAltCategory/:altCategory',middlewares_auth.authenticateToken,(req,res,next)=>{next()},productAPI.getProductByAltCategory)

app.get('/api/stroyka/get/altcategories',middlewares_auth.authenticateToken,(req,res,next)=>{next()},altCategoryAPI.getAltCategories)
app.get('/api/stroyka/get/altcategoriesBySubCatID/:id',middlewares_auth.authenticateToken,(req,res,next)=>{next()},altCategoryAPI.getAltCategoriesBySubCategory)

app.get('/api/stroyka/get/subcategories',middlewares_auth.authenticateToken,(req,res,next)=>{next()},subCatAPI.getSubCats)
app.get('/api/stroyka/get/subcategoriesByCatID/:id',middlewares_auth.authenticateToken,(req,res,next)=>{next()},subCatAPI.getSubCatsByCatID)

app.get('/api/stroyka/get/categories',middlewares_auth.authenticateToken,(req,res,next)=>{next()},categoryAPI.getCategories)
app.get('/api/stroyka/get/about',middlewares_auth.authenticateToken,(req,res,next)=>{next()},aboutUsAPI.getAbout)
app.post('/api/stroyka/filter/product/subcategory',middlewares_auth.authenticateToken,middlewares_validation.validationRuleFilterProduct("subcategory"),(req,res,next)=>{
       next()
},productAPI.filterPriceBySubCat)
app.post('/api/stroyka/filter/product/category',middlewares_auth.authenticateToken,middlewares_validation.validationRuleFilterProduct("category"),(req,res,next)=>{next()},productAPI.filterPriceByCategory)
app.post('/api/stroyka/filter/product/altcategory',middlewares_auth.authenticateToken,middlewares_validation.validationRuleFilterProduct("altcategory"),(req,res,next)=>{next()},productAPI.filterPriceByAltCat)

app.post('/api/stroyka/contactus/',middlewares_auth.authenticateToken,middlewares_validation.validationRuleContact(),(req,res,next)=>{next()},contactAPI.postContact)


app.post('/api/stroyka/register/user',middlewares_validation.validationRuleRegister(),(req,res,next)=>{next()},UserAPI.UserRegister)
app.post('/api/stroyka/login/user',UserAPI.UserLogin)
app.get('/api/stroyka/product/livesearch',middlewares_auth.authenticateToken,(req,res,next)=>{
       next()
},productAPI.liveSearchProduct);
module.exports=app.listen(port,() => {
       console.log('Listening');
})