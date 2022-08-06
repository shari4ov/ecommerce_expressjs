const express = require('express');
const app = express()
var cors = require('cors')
const port = 3000;
const productAPI = require('./controller/ProductController')
const altCategoryAPI = require("./controller/AltCategoryController");
const subCatAPI = require('./controller/SubCategoryController')
const categoryAPI = require('./controller/CategoryController')
app.use(cors())
app.get('/api/stroyka/get/products/all',productAPI.getProduct)
app.get('/api/stroyka/get/products/byId/:id',productAPI.getProductByID)
app.get('/api/stroyka/get/products/byCategory/:category',productAPI.getProductByCategory)
app.get('/api/stroyka/get/products/bySubCategory/:subCategory',productAPI.getProductBySubCategory)
app.get('/api/stroyka/get/products/byAltCategory/:altCategory',productAPI.getProductByAltCategory)

app.get('/stroyka/get/altcategories',altCategoryAPI.getAltCategories)
app.get('/stroyka/get/altcategoriesBySubCatID/:id',altCategoryAPI.getAltCategoriesBySubCategory)

app.get('/stroyka/get/subcategories',subCatAPI.getSubCats)
app.get('/stroyka/get/subcategoriesByCatID/:id',subCatAPI.getSubCatsByCatID)

app.get('/stroyka/get/categories',categoryAPI.getCategories)

app.listen(port,() => {
       console.log('Listening');
})