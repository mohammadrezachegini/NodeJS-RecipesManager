const fileupload = require("./express-fileUpload");
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

        // Rename the image with a unique name (timestamp + extension)
        const imageName = `${Date.now()}${type}`;
        
        // Define the upload path
        const uploadPath = path.join(createUploadPath(), imageName);

        // Move the uploaded image to the defined upload path
        await image.mv(uploadPath);

        // Store the image path in the request body for later use
        req.body.image = uploadPath;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadFile
};
