const { Router } = require('express');
const multer = require('multer');
const uuid = require('uuid/v4');
const fs = require('fs-extra');
const path = require('path');

const router = Router();

const ImageController = require('../controllers/ImageController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(req.user) {
            const ruta = path.join(__dirname,'../public/img/uploads/'+req.user.username);
            if(!fs.existsSync(ruta))
                fs.mkdirSync(ruta);
            return cb(null, ruta);
        }
        return cb(null, '');
    },
    filename: (req, file, cb, filename) => {
        // console.log(file)
        cb(null, uuid() + path.extname(file.originalname))
    }
})

router.get('/images', ImageController.getImages);
router.post('/images', ImageController.addLike);

router.post('/upload', multer({ storage }).single('image'), ImageController.uploadImage);

module.exports = router;
