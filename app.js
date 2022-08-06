const express = require('express');
const app = express()
var cors = require('cors')
const port = 3000;
const productAPI = require('./controller/ProductController')

app.use(cors())
app.get('/api/stroyka/get/products/all',productAPI.getProduct)
app.get('/api/stroyka/get/products/byId/:id',productAPI.getProductByID)
app.get('/api/stroyka/get/products/byCategory/:category',productAPI.getProductByCategory)
app.get('/api/stroyka/get/products/bySubCategory/:subCategory',productAPI.getProductBySubCategory)
app.get('/api/stroyka/get/products/byAltCategory/:altCategory',productAPI.getProductByAltCategory)

app.listen(port,() => {
       console.log('Listening');
})