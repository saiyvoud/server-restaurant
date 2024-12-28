import mysql from "mysql";
// const connected = mysql.createConnection({
//     host: "localhost",
//     user:"root",
//     password: "",
//     database: "db_restaurant_2024"
// });
const connected = mysql.createConnection({
    host: "mysql-189700-0.cloudclusters.net",
    port: "19666",
    user: "admin",
    password: "oah7MNJ2",
    database: "db_restaurant_2024"
})
connected.connect((err)=>{
    if(err) console.log(`Faild Connect Database`,err);
    console.log(`Connected Database`);
})
export default connected;
