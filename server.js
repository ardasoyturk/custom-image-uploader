const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const config = require('./config.js');
app.use(fileUpload());
app.use(express.static(config.imageDir));
app.enable('trust proxy');

app.post('/upload', function(req, res) {
  const fileName = `${makeid(config.randomLength)}.${req.files[config.fieldname].name.split('.')[1]}`; 
  if (req.headers.key === config.token) {
    req.files[config.fieldname].mv(`./${config.imageDir}/${fileName}`, (err) => {
      if (err) {
          return res.status(500).json({success:false});
      } else {
          return res.status(200).json({success: true, url: `${config.domain}/${config.imageDir}/${fileName}`})
      }
    })
  } else {
    res.status(403).send('Forbidden');
  }
});
function makeid(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   if (fs.readdirSync('./'+config.imageDir).some(sa => sa.includes(result))) {
     makeid(length);
   }
   return result;
}


app.listen(3000, () => console.log('Listening...'))
