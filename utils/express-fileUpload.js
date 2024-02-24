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

        // Validate file type
        if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(type)) {
            throw { status: 400, message: "Unsupported file format. Allowed formats: .png, .jpg, .jpeg, .webp, .gif" };
        }

        // Generate the upload path
        const imageName = `${Date.now()}${type}`; // Unique image name
        const imagePath = path.join(createUploadPath(), imageName);
        const uploadPath = path.join(__dirname, "..", imagePath);

        // Move the file to the upload directory
        image.mv(uploadPath, (err) => {
            if (err) {
                throw { status: 500, message: "Failed to upload the image." };
            }
            // Save the path or URL of the uploaded image in the request to use in the next middleware or controller
            req.body.image = imagePath; // Adjust this according to how you wish to use the image path
            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadFile
};
