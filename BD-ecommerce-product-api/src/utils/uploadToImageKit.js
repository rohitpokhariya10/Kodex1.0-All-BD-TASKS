const imagekit = require("../config/imageKit");

const uploadToImageKit = async ({ file, fileName, folder }) => {
  const uploadedImage = await imagekit.upload({
    file,
    fileName,
    folder,
  });

  return {
    url: uploadedImage.url,
    fileId: uploadedImage.fileId,
    thumbnailUrl: uploadedImage.thumbnailUrl,
  };
};

module.exports = uploadToImageKit;