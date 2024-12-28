import express from "express";
import CategoryController from "../controller/category.js";
import MenuController from "../controller/menu.js";
import SaleController from "../controller/sale.js";
import SaleDetailController from "../controller/sale_detail.js";
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
//---- category ----
const category = "/category";
router.get(`${category}/selectOne/:categoryID`,auth,CategoryController.SelectOne);
router.get(`${category}/selectAll`,auth,CategoryController.SelectAll);
router.post(`${category}/insert`,auth,CategoryController.Insert);
router.put(`${category}/update/:categoryID`,auth,CategoryController.UpdateCategory);
router.delete(`${category}/delete/:categoryID`,auth,CategoryController.DeleteCategory);
//----- menu ----
const menu = "/menu";
router.get(`${menu}/selectAll`,auth,MenuController.SelectAll)
router.get(`${menu}/selectOne/:menuID`,auth,MenuController.SelectOne)
router.get(`${menu}/search`,auth,MenuController.SearchMenu)
router.get(`${menu}/selectBy/:categoryID`,auth,MenuController.SelectBy)
router.post(`${menu}/insert`,auth,MenuController.insert)
router.put(`${menu}/update/:menuID`,auth,MenuController.updateMenu)
router.delete(`${menu}/delete/:menuID`,auth,MenuController.deleteMenu)
//----- sale ---
const sale = "/sale";
router.get(`${sale}/selectAll`,auth,SaleController.SelectAll)
router.get(`${sale}/selectOne/:saleID`,auth,SaleController.SelectOne)
router.get(`${sale}/selectBy/:status`,auth,SaleController.SelectBy)
router.post(`${sale}/insert`,auth,SaleController.Insert)
router.put(`${sale}/update/:saleID`,auth,SaleController.updateSale)
router.put(`${sale}/updateStatus/:saleID`,auth,SaleController.updateStatus)
router.delete(`${sale}/delete/:saleID`,auth,SaleController.deleteSale)
//----- sale detail ---
const sale_detail = "/sale_detail";
router.get(`${sale_detail}/selectAll`,auth,SaleDetailController.SelectAll)
router.get(`${sale_detail}/selectOne/:sale_detail_ID`,auth,SaleDetailController.SelectOne)
router.get(`${sale_detail}/selectBy/:saleID`,auth,SaleDetailController.SelectBy)
router.post(`${sale_detail}/insert`,auth,SaleDetailController.Insert)
router.put(`${sale_detail}/update/:sale_detail_ID`,auth,SaleDetailController.updateSaleDetail)
router.delete(`${sale_detail}/delete/:sale_detail_ID`,auth,SaleDetailController.deleteSaleDetail)
export default router;