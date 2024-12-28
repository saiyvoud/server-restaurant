import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import connected from "../config/db_mysql.js";
import { v4 as uuidv4 } from "uuid";
import { UploadImageToCloud } from "../config/cloudinary.js";
import { CheckMenu, FindOneCategory } from "../service/service.js";

export default class MenuController {
  static async SearchMenu(req, res) {
    try {
      const search = req.query.search;
      const select = `Select * from menu where menuName like ?`;
      const data = `%${search}%`;
      connected.query(select, data, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) {
          return SendError(res, 404, EMessage.NotFound, "search");
        }
        return SendSuccess(res, SMessage.Search, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectBy(req, res) {
    try {
      const categoryID = req.params.categoryID;
      const select = `Select * from menu 
          INNER JOIN category on menu.categoryID 
          COLLATE utf8mb4_general_ci = category.categoryID
          where menu.categoryID=?`;
      connected.query(select, categoryID, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        return SendSuccess(res, SMessage.SelectOne, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectOne(req, res) {
    try {
      const menuID = req.params.menuID;
      const select = `Select * from menu 
      INNER JOIN category on menu.categoryID 
      COLLATE utf8mb4_general_ci = category.categoryID
      where menuID=?`;
      connected.query(select, menuID, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        return SendSuccess(res, SMessage.SelectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectAll(req, res) {
    try {
      const select = `Select * from menu  
      INNER JOIN category on menu.categoryID 
      COLLATE utf8mb4_general_ci = category.categoryID`;
      connected.query(select, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        return SendSuccess(res, SMessage.SelectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async insert(req, res) {
    try {
      const { categoryID, menuName, price } = req.body;
      const validate = await ValidateData({ categoryID, menuName, price });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const data = req.files;
      if (!data || !data.image) {
        return SendError(res, 400, EMessage.BadRequest, "image");
      }
      const checkCategory = await FindOneCategory(categoryID);
      if (!checkCategory)
        return SendError(res, 404, EMessage.NotFound, "category");
      const menuID = uuidv4();
      const img_url = await UploadImageToCloud(
        data.image.data,
        data.image.mimetype
      );
      if (!img_url) return SendError(res, 404, EMessage.ErrUpload);
      const insert = `insert into menu (menuID,categoryID,menuName,price,image)
       values(?,?,?,?,?)`;
      connected.query(
        insert,
        [menuID, categoryID, menuName, price, img_url],
        (err) => {
          if (err) return SendError(res, 404, EMessage.ErrInsert, err);
          return SendCreate(res, SMessage.Insert);
        }
      );
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async updateMenu(req, res) {
    try {
      const menuID = req.params.menuID;
      const { menuName, price } = req.body;
      const validate = await ValidateData({ menuName, price });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const data = req.files;
      if (!data || !data.image) {
        // ຖ້າບໍ່ສົ່ງຮູບມາແມ່ນຈະອັບເດດເລີຍ
        const update = "Update menu set menuName=? , price=? where menuID=?";
        connected.query(update, [menuName, price, menuID], (err) => {
          if (err) return SendError(res, 404, EMessage.ErrUpdate, err);
          return SendSuccess(res, SMessage.Update);
        });
      } else {
        const img_url = await UploadImageToCloud(
          data.image.data,
          data.image.mimetype
        );
        if (!img_url) return SendError(res, 404, EMessage.ErrUpload);
        const update =
          "Update menu set menuName=?,price=?,image=? where menuID=?";
        connected.query(update, [menuName, price, img_url, menuID], (err) => {
          if (err) return SendError(res, 404, EMessage.ErrUpdate, err);
          return SendSuccess(res, SMessage.Update, img_url);
        });
      }
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async deleteMenu(req, res) {
    try {
      const menuID = req.params.menuID;
      const check = await CheckMenu(menuID);
      if (!check) {
        return SendError(res, 404, EMessage.NotFound, "menu");
      }
      const deleted = "Delete from menu where menuID=?";
      connected.query(deleted, menuID, (err) => {
        if (err) return SendError(res, 404, EMessage.ErrDelete, err);
        return SendSuccess(res, SMessage.Delete);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
