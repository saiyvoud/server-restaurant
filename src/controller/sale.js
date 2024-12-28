import { EMessage, OrderStatus, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import connected from "../config/db_mysql.js";
import { v4 as uuidv4 } from "uuid";
import { UploadImageToCloud } from "../config/cloudinary.js";
import { FindOneSale } from "../service/service.js";

export default class SaleController {
  static async SelectBy(req, res) {
    try {
      const status = req.params.status;
      const checkStatus = Object.keys(OrderStatus).includes(status);
      if (!checkStatus) {
        return SendError(res, 404, EMessage.NotFound, "status");
      }
      const select = `Select * from sale where status=?`;
      connected.query(select, status, (err, result) => {
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
      const saleID = req.params.saleID;
      const select = `Select * from sale where saleID=?`;
      connected.query(select, saleID, (err, result) => {
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
      const select = `Select * from sale `;
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
      // const { paymentType, addressType, priceTotal } = req.body;
      // const validate = await ValidateData({
      //   paymentType,
      //   addressType,
      //   priceTotal,
      // });
      // if (validate.length > 0) {
      //   return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      // }
      // const data = req.files;
      // if (!data || !data.image) {
      //   return SendError(res, 400, EMessage.BadRequest, "image");
      // }
      const saleID = uuidv4();
      //  if (!data || !data.image) {

      // }
      // const img_url = await UploadImageToCloud(
      //   data.image.data,
      //   data.image.mimetype
      // );
      // if (!img_url) {
      //   return SendError(res, 404, EMessage.ErrUpload);
      // }
      //   const insert = `insert into sale (saleID,paymentType,addressType,
      // priceTotal,bill_qrcode,status) values (?,?,?,?,?,?)`;
      const insert = `insert into sale (saleID,status) values (?,?)`;
      connected.query(
        insert,
        [
          saleID,
          // paymentType,
          // addressType,
          // priceTotal,
          // img_url,
          OrderStatus.padding,
        ],
        (err) => {
          if (err) return SendError(res, 404, EMessage.ErrInsert, err);
          return SendCreate(res, SMessage.Insert);
        }
      );
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async updateSale(req, res) {
    try {
      const saleID = req.params.saleID;
      const checkSale = await FindOneSale(saleID); // ຍັງບໍ່ມີ
      if (!checkSale) {
        return SendError(res, 404, EMessage.NotFound, "sale");
      }
      const { paymentType, addressType, priceTotal } = req.body;
      const validate = await ValidateData({
        paymentType,
        priceTotal,
        addressType,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const data = req.files;
      if (!data || !data.image) {
        return SendError(res, 400, EMessage.BadRequest, "image");
      }
      const img_url = await UploadImageToCloud(
        data.image.data,
        data.image.mimetype
      );
      if (!img_url) {
        return SendError(res, 404, EMessage.ErrUpload);
      }
      const updated = `Update sale set 
        paymentType=?,addressType=?,priceTotal=?,bill_qrcode=?,status=? where saleID=?`;
      connected.query(
        updated,
        [
          paymentType,
          addressType,
          priceTotal,
          img_url,
          OrderStatus.success,
          saleID,
        ],
        (err) => {
          if (err) return SendError(res, 404, EMessage.ErrUpdate, err);
          return SendSuccess(res, SMessage.Update);
        }
      );
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async updateStatus(req, res) {
    try {
      const saleID = req.params.saleID;
      const checkSale = await FindOneSale(saleID);
      if (!checkSale) {
        return SendError(res, 404, EMessage.NotFound, "sale");
      }
      const { status } = req.body;
      if (!status) {
        return SendError(res, 400, EMessage.BadRequest, "status");
      }
      const check = Object.keys(OrderStatus).includes(status);
      if (!check) {
        return SendError(res, 400, EMessage.NotFound, "status");
      }
      const updated = "Update sale set status=? where saleID=?";
      connected.query(updated, [status, saleID], (err) => {
        if (err) return SendError(res, 404, EMessage.ErrUpdate, err);
        return SendSuccess(res, SMessage.Update);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async deleteSale(req, res) {
    try {
      const saleID = req.params.saleID;
      const checkSale = await FindOneSale(saleID);
      if (!checkSale) {
        return SendError(res, 404, EMessage.NotFound, "sale");
      }
      const deletesale = "Delete from sale where saleID=?";
      connected.query(deletesale, saleID, (err) => {
        if (err) return SendError(res, 404, EMessage.ErrDelete, err);
        return SendSuccess(res, SMessage.Delete);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
