const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {   // было cd → сделал cb
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {      // было cd и ещё кириллическая "сb"
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {  // тоже делаем cb
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);   // если тип допустим → разрешаем
    } else {
        cb(new Error('Only .jpeg, .jpg and .png formats are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

