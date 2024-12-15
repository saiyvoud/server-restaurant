import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import connected from "../config/db_mysql.js";
import { v4 as uuidv4 } from "uuid";
import {
  Encrypt,
  CheckUser,
  CheckUserAlready,
  Decrypt,
  GenerateToken,
  FindOneUser,
} from "../service/service.js";
export default class UserController {
  static async SelectOne(req, res) {
    try {
      const userID = req.params.userID;

      const select = "Select * from user where userID=?";
      connected.query(select, userID, (err, result) => {
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
      const select = "Select * from user";
      connected.query(select, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        return SendSuccess(res, SMessage.SelectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Login(req, res) {
    try {
      const { username, password } = req.body;
      const validate = await ValidateData({ username, password });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const checkUsername = await CheckUser(username);
      if (!checkUsername) {
        return SendError(res, 404, EMessage.NotFound);
      }
      const decryptPassword = await Decrypt(checkUsername.password);
      if (decryptPassword !== password) {
        return SendError(res, 404, EMessage.IsNotMatch);
      }
      const token = await GenerateToken(checkUsername);
      const data = Object.assign(
        JSON.parse(JSON.stringify(checkUsername)),
        JSON.parse(JSON.stringify(token))
      );
      return SendSuccess(res, SMessage.Login, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ErrServer, error);
    }
  }
  static async Register(req, res) {
    try {
      const { firstname, lastname, phoneNumber, username, password } = req.body;
      const validate = await ValidateData({
        firstname,
        lastname,
        phoneNumber,
        username,
        password,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const already = await CheckUserAlready(username);
      if (!already) {
        return SendError(res, 208, SMessage.Already);
      }
      const userID = uuidv4();
      const encrypt = await Encrypt(password);
      const insert = `Insert into user 
      (userID,firstname,lastname,phoneNumber,username,password)
      values (?,?,?,?,?,?)`;
      connected.query(
        insert,
        [userID, firstname, lastname, phoneNumber, username, encrypt],
        (err) => {
          if (err) return SendError(res, 404, EMessage.ErrInsert, err);
          return SendCreate(res, SMessage.Register);
        }
      );
    } catch (error) {
      return SendError(res, 500, EMessage.ErrServer, error);
    }
  }
  static async Forgot(req, res) {
    try {
      const { username, password } = req.body;
      const validate = await ValidateData({ username, password });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const checkUser = await CheckUser(username);
      if (!checkUser) {
        return SendError(res, 404, EMessage.NotFound, "user");
      }
      const encryptPassword = await Encrypt(password);
      if (!encryptPassword) {
        return SendError(res, 400, EMessage.BadRequest);
      }
      const updated = "Update user set password=? where username=?";
      connected.query(updated, [encryptPassword, username], (err) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.Update);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ErrServer, error);
    }
  }
  static async UpdateUser(req, res) {
    try {
      const userID = req.params.userID;
      const checkUser = await FindOneUser(userID);
      if (!checkUser) {
        return SendError(res, 404, EMessage.NotFound);
      }
      const { username, firstname, lastname, phoneNumber } = req.body;
      const validate = await ValidateData({
        username,
        firstname,
        lastname,
        phoneNumber,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const Update = `Update user set username=?,firstname=?,
      lastname=?,phoneNumber=? where userID=?`;
      connected.query(
        Update,
        [username, firstname, lastname, phoneNumber, userID,],
        (err) => {
          if (err) return SendError(res, 404, EMessage.ErrUpdate, err);
          return SendSuccess(res, SMessage.Update);
        }
      );
      //-----
    } catch (error) {
      return SendError(res, 500, EMessage.ErrServer, error);
    }
  }
  static async DeleteUser(req, res) {
    try {
      const userID = req.params.userID;
      const checkUser = await FindOneUser(userID);
      if (!checkUser) {
        return SendError(res, 404, EMessage.NotFound);
      }
      const Delete = "Delete from user where userID=?";
      connected.query(Delete, userID, (err) => {
        if (err) return SendError(res, 404, EMessage.ErrDelete, err);
        return SendSuccess(res, SMessage.Delete);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.ErrServer, error);
    }
  }
}
