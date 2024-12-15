import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import connected from "../config/db_mysql.js";
import { v4 as uuidv4 } from "uuid";
import { UploadImageToCloud } from "../config/cloudinary.js";
import { FindOneCategory } from "../service/service.js";
export default class CategoryController {
  static async SelectOne(req, res) {
    try {
      const categoryID = req.params.categoryID;

      const select = "Select * from category where categoryID=?";
      connected.query(select, categoryID, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        return SendSuccess(res, SMessage.SelectAll, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectAll(req, res) {
    try {
      const select = "Select * from category";
      connected.query(select, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        return SendSuccess(res, SMessage.SelectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Insert(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return SendError(res, 400, EMessage.BadRequest + "name");
      }
      const data = req.files;
      if (!data || !data.icon) {
        return SendError(res, 400, EMessage.BadRequest + "icon");
      }
      const img_url = await UploadImageToCloud(
        data.icon.data,
        data.icon.mimetype
      );
      if (!img_url) {
        return SendError(res, 404, EMessage.ErrUpload);
      }
      const categoryID = uuidv4();
      const inserted =
        "Insert into category (categoryID,name,icon) values (?,?,?)";
      connected.query(inserted, [categoryID, name, img_url], (err) => {
        if (err) return SendError(res, 404, EMessage.ErrInsert, err);
        return SendCreate(res, SMessage.Insert, img_url);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async UpdateCategory(req, res) {
    try {
      const categoryID = req.params.categoryID;
        const checkCategory = await FindOneCategory(categoryID);
        if (!checkCategory) {
          return SendError(res, 404, EMessage.NotFound);
        }
      const { name,oldImage } = req.body;
      const validate = await ValidateData({ name ,oldImage});
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }

      const data = req.files;
      if (!data || !data.icon) {
        return SendError(res, 400, EMessage.BadRequest + "icon");
      }
     
      const img_url = await UploadImageToCloud(
        data.icon.data,
        data.icon.mimetype,
        oldImage,
      );
  
      if (!img_url) {
        return SendError(res, 404, EMessage.ErrUpload);
      }
      const updated = "Update category set name=?,icon=? where categoryID=?";
      connected.query(updated, [name, img_url, categoryID], (err) => {
        if (err) return SendError(res, 404, EMessage.ErrUpdate, err);

        return SendSuccess(res, SMessage.Update, img_url);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async DeleteCategory(req, res) {
    try {
      const categoryID = req.params.categoryID;
      await FindOneCategory(categoryID);
      const deleted = "Delete from category where categoryID=?";
      connected.query(deleted, categoryID, (err) => {
        if (err) return SendError(res, 404, EMessage.ErrDelete, err);
        return SendSuccess(res, SMessage.Delete);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
