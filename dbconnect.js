const {Sequelize}=require("sequelize");

const sequelize =new Sequelize("backend","root","tiyasadb",{
    host:'localhost',
    dialect:'mysql',
});

sequelize
.authenticate().
then(()=>{
    console.log("Connected Successfully");
})
.catch((err)=>{
    console.log(" not Connected due to"+err);
});
module.exports=sequelize;