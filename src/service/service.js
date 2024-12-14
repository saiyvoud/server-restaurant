import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import connected from "../config/db_mysql.js";
import { SCRETE_KEY, SCRETE_KEY_REFRESH } from "../config/globalKey.js";
import { EMessage } from "./message.js";
export const CheckUser = async (username) => {
  return new Promise(async (resovle, reject) => {
    try {
      const check = "select * from user where username=?";
      connected.query(check, username, (err, result) => {
        if (err) reject(err);
        if (!result[0]) {
          reject(EMessage.NotFound + "username");
        }
        resovle(result[0]);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const CheckUserAlready = async (username) => {
  return new Promise(async (resovle, reject) => {
    try {
      const check = "select * from user where username=?";
      connected.query(check, username, (err, result) => {
        if (err) reject(err);
        if (result[0]) {
          reject("username is already");
        }
        resovle(true);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const VertifyToken = async (token) => {
  return new Promise(async (resovle, reject) => {
    try {
      jwt.verify(token, SCRETE_KEY, async (err, decode) => {
        if (err) reject(err);
        const user = await FindOneUser(decode.id);
        if (!user) {
          reject(err);
        }
        resovle(user.userID);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const FindOneUser = async (userID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const checkUser = "Select * from user where userID=?";
      connected.query(checkUser, userID, (err, result) => {
        if (err) reject(err);
        if (!result[0]) reject(EMessage.NotFound + " user");
        resovle(result[0]);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const GenerateToken = async (data) => {
  try {
    const payload = {
      id: data.userID,
    };
    const payload_refresh = {
      id: payload.id,
    };
    const token = jwt.sign(payload, SCRETE_KEY, { expiresIn: "2h" });
    const refreshToken = jwt.sign(payload_refresh, SCRETE_KEY_REFRESH, {
      expiresIn: "4h",
    });
    return { token, refreshToken };
  } catch (error) {
    console.log(error);
    return "";
  }
};
export const Encrypt = async (data) => {
  const decode = CryptoJS.AES.encrypt(data, SCRETE_KEY).toString();
  return decode;
};
export const Decrypt = async (data) => {
  const decode = CryptoJS.AES.decrypt(data, SCRETE_KEY).toString(
    CryptoJS.enc.Utf8
  );
  return decode;
};