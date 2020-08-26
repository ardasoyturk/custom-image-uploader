const express = require('express');
const multer = require('multer');
const app = express();
const config = require('./config.js');
app.use(express.static('i'));
app.enable('trust proxy');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/i')
  },
  filename: function (req, file, cb) {
    let str = makeid(5) + '.' + file.originalname.split('.')[1]
    cb(null, str)
  }
})
var upload = multer({ storage })

app.post('/upload', (req, res) => {
  if (req.headers.key !== config.token) return res.sendStatus(403)
  upload.single(config.fieldname)(req, res => {
    let str = config.domain + req.file.filename;
    res.json({ url: str })
  }
})

function makeid(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


app.listen(3000, () => console.log('Listening...'))
