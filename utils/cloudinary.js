const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name:'dyvqkpndb',
  api_key: '513845819179262',
  api_secret: '2YfNA8__mR1B8M73mW0yj2G_614',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'home_hunt_uploads', // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

module.exports = { cloudinary, storage };
