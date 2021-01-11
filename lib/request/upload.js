const multer = require('multer');
const userInfo = require('./getSessionUser');
const sharp = require('sharp');


const multerStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'build/img/avatars/');
  },
  filename: async (req, file, cb) => {
  	let user = await userInfo(req);
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${user.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.', 400), false);
  }
};


const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

function uploadAvatar(){
  return upload.single('avatar');
}

function checkUploadedFile(req){
  if(!req.file)return false;
  let {mimetype, size, filename} = req.file;

  if(size > 2000000){
    return false;
  }

  if(!mimetype.match('image')){
    return false;
  }

  return filename;
}

async function resizeAvatar(req, res, next){
  console.log(req.file)
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/avatars/${req.file.filename}`);

  next();
};


module.exports = {
  uploadAvatar,
  checkUploadedFile,
  resizeAvatar,

}