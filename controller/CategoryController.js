const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getCategories = async (req,res) => {
       try{
              await prisma.$connect;
              const categories = await prisma.category.findMany();
              res.status(200).json(categories)
       } catch(e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}

module.exports = {
       getCategories
}