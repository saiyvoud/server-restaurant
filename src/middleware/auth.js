import { EMessage } from "../service/message.js";
import { SendError } from "../service/response.js";
import { VertifyToken } from "../service/service.js";

export const auth = async (req, res, next) => {
  try {
    const authorizate = req.headers["authorization"]; // 
    if (!authorizate) {
      return SendError(res, 401, EMessage.Unauthorization);
    }
    const token = authorizate.replace("Bearer ", "");
    if (!token) {
      return SendError(res, 401, EMessage.Unauthorization);
    }
    const verify = await VertifyToken(token);
    if (!verify) {
      return SendError(res, 401, EMessage.Unauthorization);
    }
    req.user  = verify;
    // req.user = localo storage 
    next()
    // function next ບອກໃຫ້ທຳງານໄປຕໍ່
  } catch (error) {
    return SendError(res, 500, EMessage.ServerInternal);
  }
};
