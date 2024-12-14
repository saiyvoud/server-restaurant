import express from "express";
import UserController from "../controller/user.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
//------ user ----
const user = "/user";
router.get(`${user}/selectOne/:userID`,auth,UserController.SelectOne);
router.get(`${user}/selectAll`,auth,UserController.SelectAll);
router.post(`${user}/register`,UserController.Register);
router.post(`${user}/login`,UserController.Login);
router.put(`${user}/forgot`,UserController.Forgot);
router.put(`${user}/update/:userID`,auth,UserController.UpdateUser);
router.delete(`${user}/delete/:userID`,auth,UserController.DeleteUser);
export default router;