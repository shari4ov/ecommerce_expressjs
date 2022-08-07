const express = require('express');
const app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
const port = 3000;
const productAPI = require('./controller/ProductController')
const altCategoryAPI = require("./controller/AltCategoryController");
const subCatAPI = require('./controller/SubCategoryController')
const categoryAPI = require('./controller/CategoryController')
const contactAPI = require('./controller/ContactController')
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

const validationRule = () => {
       return [
              body('name').notEmpty().matches(/^[a-zA-Z\s]*$/).escape().trim().withMessage("Ad düzgün doldurulmayıb"),
              body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage("E-mail  düzgün doldurulmayıb"),
              body('phone').notEmpty().matches(/^[+]?[0-9]{3}?[(]?[0-9]{2}[)]?[0-9]{4,7}$/).escape().trim().withMessage("Nömrə düzgün doldurulmayıb"),
              body('message').notEmpty().escape().trim().withMessage("Məktub düzgün deyil")
       ]
}
app.post('/api/stroyka/contactus/',validationRule(),contactAPI.postContact)
module.exports=app.listen(port,() => {
       console.log('Listening');
})