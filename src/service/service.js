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
export const FindOneMenu = async (menuID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const checkMenu = "Select * from menu where menuID=?";
      connected.query(checkMenu, menuID, (err, result) => {
        if (err) reject(err);
        if (!result[0]) reject(EMessage.NotFound + " menu");
        resovle(result[0]);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const FindOneSaleDetail = async (sale_detail_ID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const checkSaleDetail =
        "Select * from sale_detail where sale_detail_ID=?";
      connected.query(checkSaleDetail, sale_detail_ID, (err, result) => {
        if (err) reject(err);
        if (!result[0]) reject(EMessage.NotFound + " sale");
        resovle(result[0]);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const FindOneSale = async (saleID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const checkSale = "Select * from sale where saleID=?";
      connected.query(checkSale, saleID, (err, result) => {
        if (err) reject(err);
        if (!result[0]) {
          console.log(result);
          reject(EMessage.NotFound + " sale");
        }
        resovle(result[0]);
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
export const FindOneCategory = async (categoryID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const checkCategory = "Select * from category where categoryID=?";
      connected.query(checkCategory, categoryID, (err, result) => {
        if (err) reject(err);

        if (!result[0]) {
          reject(EMessage.NotFound + " category");
        }
        resovle(true);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const CheckMenu = async (menuID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const checkMenu = "Select * from menu where menuID=?";
      connected.query(checkMenu, menuID, (err, result) => {
        if (err) reject(err);

        if (!result[0]) {
          reject(EMessage.NotFound + " menu");
        }
        resovle(true);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const CheckEmail = async (email) => {
  return new Promise(async (resovle, reject) => {
    try {
      const checkEmail = "Select * from user where email=?";
      connected.query(checkEmail, email, (err, result) => {
        if (err) reject(err);
        if (!result[0]) reject(EMessage.NotFound + " email");
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
