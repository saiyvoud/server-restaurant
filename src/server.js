import express from "express";
import { PORT } from "./config/globalKey.js";
import "./config/db_mysql.js"
import router from "./router/route.js";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
app.use(cors()); // ໃຫ້ສາມາດຮັບ Request ຫລື ຮັບຂໍ້ມູນຈາກ Client ຫລື front end ຫລື ແອັບ ໄດ້
app.use(bodyParser.json({extended: true,limit: "500mb",parameterLimit: 500})); 
app.use(bodyParser.urlencoded({extended: true,limit: "500mb", parameterLimit: 500}));
app.use("/api",router); // http://localhost:3000/api/user/register
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})