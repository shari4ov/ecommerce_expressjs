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
const checkOutAPI = require('./controller/CheckOutController')
const sliderAPI = require('./controller/SliderController')
var {body} = require('express-validator');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

require('./routes/admin_route')(app)
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
app.get('/api/stroyka/get/slider',sliderAPI.getSliders)
app.post('/api/stroyka/filter/product/subcategory',productAPI.filterPriceBySubCat)
app.post('/api/stroyka/filter/product/category',productAPI.filterPriceByCategory)
app.post('/api/stroyka/filter/product/altcategory',productAPI.filterPriceByAltCat)

app.post('/api/stroyka/contactus/',contactAPI.postContact)


app.post('/api/stroyka/register/user',UserAPI.UserRegister)
app.post('/api/stroyka/login/user',UserAPI.UserLogin)
app.get('/api/stroyka/product/livesearch',productAPI.liveSearchProduct);

app.post('/api/stroyka/logout/user',middlewares_auth.authenticateToken,(err, req, res, next)=>{
       if (err.name === "TokenExpiredError") {
             return res.status(401).send("invalid token...");
       } else {
              next();
       }
},UserAPI.UserLogout)
app.post('/api/stroyka/checkout',middlewares_auth.authenticateToken,(err,req,res,next) => {
       if(err.name === "TokenExpiredError") {
              return res.status(401).send("Invalid token");
       } else {
              next();
       }
},checkOutAPI.checkOut)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

module.exports=app.listen(port,() => {
       console.log('Listening');
})