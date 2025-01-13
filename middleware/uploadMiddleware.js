const multer = require('multer');
console.log('multer')
const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
    const fileRegex = /\.(jpg|jpeg|png|webp|svg|pdf)$/;
    const fileName = file.originalname;
    
    if (!fileName.match(fileRegex)) {
        return cb(new Error('Invalid file type'));
    }
    
    cb(null, true);
};

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    // fileFilter: fileFilter
}).fields([
    { name: 'offer_letter', maxCount: 1 }, 
    // { name: 'contentImage', maxCount: 4 }, { name: 'logoImage', maxCount: 1 }
]);

const uploadSettingLogo = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 },
    // filter: fileFilter,
}).single()

module.exports = {uploadFile, uploadSettingLogo};