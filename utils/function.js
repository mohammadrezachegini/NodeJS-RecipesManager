const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")
const createError = require("http-errors")
const { reject } = require("bcrypt/promises")
const { UserModel } = require("../app/models/user")
const { SECRET_KEY, ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constants")
const path = require("path")
const fs = require("fs")

function HashString(str){

    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(str,salt)

}


function randomNumberGenerator() {
    return Math.floor((Math.random() * 90000) + 10000 )
}


function SignAccessToken(userId){
    return new Promise(async (resolve, reject)=> {
        const user = await  UserModel.findById(userId)
        const payload = {
            email: user.email,
        };
        const secret = ACCESS_TOKEN_SECRET_KEY;
        const options = {
            expiresIn: "1h"
        };

        jwt.sign(payload,ACCESS_TOKEN_SECRET_KEY,options, (err, token) => {
            if (err) reject(createError.InternalServerError("Internal server error"))
            resolve(token)
        })
    })

}





function SignRefreshToken(userId){
    return new Promise(async (resolve, reject)=> {
        const user = await  UserModel.findById(userId)
        const payload = {
            email: user.email
        };
        // const secret = REFRESH_TOKEN_SECRET_KEY;
        const options = {
            expiresIn: "1y"
        };

        jwt.sign(payload,REFRESH_TOKEN_SECRET_KEY,options, async (err, token) => {
            if (err) {
                reject(createError.InternalServerError("Internal server error"))
            }
            

            resolve(token)
        })
    })

}




function createUploadPath(){
    let d = new Date();
    const year = "" + d.getFullYear();
    const month = d.getMonth() + "";
    const day = "" + d.getDay();
    const uploadPath = path.join(__dirname, "..", "public", "upload", year, month, day)
    console.log(uploadPath)
    console.log("dir is ",path.join(__dirname));
    fs.mkdirSync(uploadPath, {recursive: true})
    return path.join("public", "upload", year, month, day)
}




function createLink(fileAddress, req) {
    if (fileAddress) {
        // Directly return the fileAddress if it is already a full URL, assuming no need to modify these
        if (/^https?:\/\//.test(fileAddress)) {
            // Here, you might also check and remove '/public/' from full URLs if needed
            return fileAddress.replace('/public/', '/'); 
        } else {
            // For relative paths, ensure 'public/' is removed and construct the URL
            const cleanAddress = fileAddress.replace(/^public\//, '').replace(/[\\]/gm, "/");
            return `${req.protocol}://${req.get("host")}/${cleanAddress}`;
        }
    } else {
        return undefined;
    }
}


module.exports = {
    randomNumberGenerator,
    SignAccessToken,
    SignRefreshToken,
    HashString,
    createUploadPath,
    createLink
}