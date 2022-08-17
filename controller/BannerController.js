const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const createNewBanner = async(req,res) => {
       try {
              try{
                     await prisma.$connect;
                     let uniq_id__tmp =crypto.randomBytes(8).toString("hex");
                     try{
                            let newBanner = await prisma.banner.create({
                                   data:{
                                          uniq_id:uniq_id__tmp,
                                          title : (req.body.title),
                                          description: (req.body.description),
                                          image:req.files.image[0].path,
                                          mobile_image: req.files.mobile_image[0].path,
                                   }
                            })
                            res.status(200).send("Created");
                     }
                      catch(e){ 
                            console.log(e);
                      }
              } catch(e){
                     console.log(e);
                     res.status(501)
              }

       } catch(e){
              console.log(e);
              res.status(500).send("Invalid")
       }
}

const getBanner = async (req,res) => {
       try{
              try{
                     await prisma.$connect;
                     const banners = await prisma.banner.findMany();
                     res.status(200).json(banners)
              } catch(e){
                     console.log(e);
                     res.status(501)
              }
       }catch(e){
              console.log(e);
              res.status(500).send("Invalid")
       }
}

module.exports = {
       getBanner,
       createNewBanner
}