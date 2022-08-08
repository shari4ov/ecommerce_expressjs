const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getAbout = async (req, res) => {
    try {
        await prisma.$connect;
        try{
            const aboutData = await prisma.aboutus.findMany();
            res.status('200').json({results:[aboutData]})
        } catch(e) {
            res.status('500').json({msg:"Invalid"})
        }
    } catch (e) {
        console.log(e);
        res.status('404').json({msg: "Invalid"});
    }
}

module.exports = {
    getAbout
}