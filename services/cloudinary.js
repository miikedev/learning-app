const cloudinary = require('cloudinary').v2;

//here is cloudinary api credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.uploadImage = async (fileStream, fileName)=>{
    const result = await uploadStream(fileStream, fileName);
    return result;
}
const uploadStream = (fileStream, name) => {

  //wrapping into promise for using modern async/await
  return new Promise((resolve, reject) => {        
      cloudinary.uploader.upload_stream({ public_id: name }, (error, result) => {
          if (error) {
              reject(error);
          } else {
              resolve(result);
          }
      }).end(fileStream)
  });
};

module.exports.destroyImage = async (fileName)=>{
    await cloudinary.uploader.destroy(fileName,{invalidate: true}).then(()=> console.info('deleted file: ' + fileName));
}
