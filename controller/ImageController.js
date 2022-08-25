var fs = require('fs');
const stream = require('stream')
const getImage = async (req,res) =>{ 
       try {
             const file = req.body.file
              const r = fs.createReadStream(`./${file}`) // or any other way to get a readable stream
              const ps = new stream.PassThrough() 
              stream.pipeline(
                     r,
                     ps, // <---- this makes a trick with stream error handling
                     (err) => {
                      if (err) {
                        console.log(err) // No such file or any other kind of error
                        return res.sendStatus(400); 
                      }
                    })
                    ps.pipe(res) // 
       }catch(e){
              console.log(e);
              res.status(500)
       }
}
module.exports = {
       getImage
}