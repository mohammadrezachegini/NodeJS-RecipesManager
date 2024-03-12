const fileupload = require("express-fileupload");
const path = require("path");
const { createUploadPath } = require("./function");

const uploadFile = async (req, res, next) => {
    try {
        // Check if any file is uploaded
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
            throw { status: 400, message: "Please upload an image." };
        }

        let image = req.files.image;
        let type = path.extname(image.name).toLowerCase();

        if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(type)) {
            throw { status: 400, message: "Unsupported file format. Allowed formats: .png, .jpg, .jpeg, .webp, .gif" };
        }

        const imageName = `${Date.now()}${type}`; 
        console.log("Uploading image ----> " + imageName);
        const imagePath = path.join(createUploadPath(), imageName);
        const uploadPath = path.join(__dirname, "..", imagePath);

        image.mv(uploadPath, (err) => {
            if (err) {
                throw { status: 500, message: "Failed to upload the image." };
            }
            req.body.image = imagePath;
            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadFile
};
