const productAPI = require('../controller/ProductController')
const categoryAPI = require('../controller/CategoryController')
const subCatAPI = require('../controller/SubCategoryController')
const altCategoryAPI = require("../controller/AltCategoryController");
const sliderAPI = require('../controller/SliderController');
const bannerAPI = require('../controller/BannerController');
const upload = require('../middlewares/file_upload');
const bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({ extended: true });
module.exports= (app) => {
       app.post('/api/admin/createNewCategory',categoryAPI.createNewCategory)
       app.post('/api/admin/createNewSubCat',subCatAPI.createNewSubCat)
       app.post('/api/admin/createNewAltCat',altCategoryAPI.createNewAltCat)
       app.post('/api/admin/createNewProduct',upload.uploadProduct,parseForm,async function (req,res,next)  {
              if(upload.error_response.errors.length > 0) {
                   res.status(402).json(upload.error_response)
                  return upload.error_response.errors = []
              }
              next()
       },productAPI.createNewProduct)
       app.post('/api/admin/createNewSlider',upload.uploadSlider,parseForm,async function(req,res,next){
              if(upload.error_response.errors.length > 0) {
                     res.status(402).json(upload.error_response)
                    return upload.error_response.errors = []
              }
              next()
       },sliderAPI.createNewSlider)
       app.post('/api/admin/createNewBanner',upload.uploadBanner,parseForm,async function(req,res,next){
              if(upload.error_response.errors.length > 0) {
                     res.status(402).json(upload.error_response)
                    return upload.error_response.errors = []
              }
              next()
       },bannerAPI.createNewBanner)
       app.delete('/api/admin/delete/category',categoryAPI.deleteCategory);
       app.delete('/api/admin/delete/subcategory',subCatAPI.deleteSubCategory);
       app.delete('/api/admin/delete/altcategory',altCategoryAPI.deleteAltCategory);
       app.delete('/api/admin/delete/products',productAPI.deleteProduct);
}