const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'itransition12313213',
    api_key: '476963487363711',
    api_secret: 'auIeEhXSfIldPusghu4KC9Bm2AU',
});

module.exports = cloudinary;