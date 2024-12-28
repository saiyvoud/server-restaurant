import { EMessage, OrderStatus, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import connected from "../config/db_mysql.js";
import { v4 as uuidv4 } from "uuid";
import { UploadImageToCloud } from "../config/cloudinary.js";
import {
  FindOneMenu,
  FindOneSale,
  FindOneSaleDetail,
} from "../service/service.js";

export default class SaleDetailController {
  static async SelectBy(req, res) {
    try {
      const saleID = req.params.saleID;
      const checkStatus = await FindOneSale(saleID);
      if (!checkStatus) {
        return SendError(res, 404, EMessage.NotFound, "sale");
      }
      const select = `Select * from sale_detail 
          INNER JOIN menu on sale_detail.menuID COLLATE utf8mb4_general_ci = menu.menuID
          INNER JOIN category on menu.categoryID COLLATE utf8mb4_general_ci = category.categoryID
          where sale_detail.saleID=?`;
      connected.query(select, saleID, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        return SendSuccess(res, SMessage.SelectBy, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectOne(req, res) {
    try {
      const sale_detail_ID = req.params.sale_detail_ID;
      const select = `Select * from sale_detail 
          INNER JOIN menu on sale_detail.menuID COLLATE utf8mb4_general_ci = menu.menuID
          INNER JOIN category on menu.categoryID COLLATE utf8mb4_general_ci = category.categoryID
          where sale_detail.sale_detail_ID=?`;
      connected.query(select, sale_detail_ID, (err, result) => {
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
      const select = `Select * from sale_detail 
            INNER JOIN menu on sale_detail.menuID COLLATE utf8mb4_general_ci = menu.menuID
            INNER JOIN category on menu.categoryID COLLATE utf8mb4_general_ci = category.categoryID`;
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
      const { menuID, saleID, amount } = req.body;
      const validate = await ValidateData({ menuID, saleID, amount });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const checkMenu = await FindOneMenu(menuID);
      if (!checkMenu) {
        return SendError(res, 404, EMessage.NotFound, "menu");
      }
      const checkSale = await FindOneSale(saleID);
      if (!checkSale) {
        return SendError(res, 404, EMessage.NotFound, "sale");
      }
      const sale_detail_ID = uuidv4();
      const insert = `insert into sale_detail 
      (sale_detail_ID,menuID,saleID,amount) values (?,?,?,?)`;
      connected.query(
        insert,
        [sale_detail_ID, menuID, saleID, amount],
        (err) => {
          if (err) return SendError(res, 404, EMessage.ErrInsert, err);
          return SendCreate(res, SMessage.Insert);
        }
      );
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async updateSaleDetail(req, res) {
    try {
      const sale_detail_ID = req.params.sale_detail_ID;
      if (!sale_detail_ID) return SendError(res, 404, EMessage.BadRequest);
      const checkID = await FindOneSaleDetail(sale_detail_ID);
      if (!checkID) {
        return SendError(res, 404, EMessage.NotFound, "sale_detail");
      }
      const { amount } = req.body;
      if (!amount) return SendError(res, 404, EMessage.BadRequest, "amount");
      const update = "Update sale_detail set amount=? where sale_detail_ID=?";
      connected.query(update, [amount, sale_detail_ID], (err) => {
        if (err) return SendError(res, 404, EMessage.ErrUpdate, err);
        return SendSuccess(res, SMessage.Update);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async deleteSaleDetail(req, res) {
    try {
      const sale_detail_ID = req.params.sale_detail_ID;
      const checkSaleDetail = await FindOneSaleDetail(sale_detail_ID);
      if (!checkSaleDetail) {
        return SendError(res, 404, EMessage.NotFound, "sale detail");
      }
      const deletesale = "Delete from sale_detail where sale_detail_ID=?";
      connected.query(deletesale, sale_detail_ID, (err) => {
        if (err) return SendError(res, 404, EMessage.ErrDelete, err);
        return SendSuccess(res, SMessage.Delete);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
