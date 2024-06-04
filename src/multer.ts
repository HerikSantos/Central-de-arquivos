import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "video/mp4" ||
            file.mimetype === "vdieo/mov" ||
            file.mimetype === "vdieo/mkv"
        ) {
            cb(null, true);
        }
        cb(null, false);
    },
    limits: { fileSize: 209715200 },
});

export { upload };
