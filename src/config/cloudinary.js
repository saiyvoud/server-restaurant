import cloudinary from "cloudinary";
cloudinary.v2.config({
    cloud_name: "finalniichacafe",
    api_key: "138561877664299",
    api_secret: "B0Nx06FDoDu33uEZNDi8XH0agYw",
})
export const UploadImageToCloud = async (files, type, oldImg) => {
  try {
    if (oldImg) {
      const splitUrl = oldImg.split("/");
      const img_id = splitUrl[splitUrl.length - 1].split(".")[0];
      await cloudinary.v2.uploader.destroy(img_id);
    }
    const base64 = files.toString("base64");
    const imgPath = `data:${type};base64,${base64}`;
    const cloudinaryUpload = await cloudinary.v2.uploader.upload(imgPath, {
      folder: "assets",
      resource_type: "image",
    });
    return cloudinaryUpload.url;
  } catch (error) {
    console.log(error);
    return "";
  }
};
