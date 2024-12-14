import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import connected from "../config/db_mysql.js";
import { v4 as uuidv4 } from "uuid";
import { Encrypt,CheckUser,CheckUserAlready, Decrypt, GenerateToken } from "../service/service.js";
export default class UserController {
  static async Login(req, res) {
    try {
      const { username, password } = req.body;
      const validate = await ValidateData({ username, password });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const checkUsername = await CheckUser(username);
      if(!checkUsername){
        return SendError(res,404,EMessage.NotFound);
      }
      const decryptPassword = await Decrypt(checkUsername.password);
      if(decryptPassword !==password){
        return SendError(res,404,EMessage.IsNotMatch)
      } 
      const token = await GenerateToken(checkUsername);
      const data = Object.assign(
        JSON.parse(JSON.stringify(checkUsername)), 
        JSON.parse(JSON.stringify(token)),
      )
      return SendSuccess(res,SMessage.Login,data);
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
      if(!already){
        return SendError(res,208,SMessage.Already);
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
}
