var pmysql = require('promise-mysql');
var pool;


pmysql.createPool({

    connectionLimit :1,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024mysql'

})
.then((p)=> {
    pool = p;
})

.catch(e => {
    console.log("pool error" + e)
})

var getStudents = function () {
    return new Promise((resolve , reject) => {
      pool
        .query("SELECT * FROM student")
        .then((data) => {
          //console.log("THEN mysqldao.js");
          resolve(data);
        
        })
        .catch((error) => {
          console.log("CATCH mysqldao.js");
          reject(error);
         
        });
    });
  };
  

  var getGrades = function () {
    return new Promise((resolve , reject) => {
      pool
        .query("SELECT * FROM grade")
        .then((data) => {
          //console.log("THEN mysqldao.js");
          resolve(data);
        
        })
        .catch((error) => {
          console.log("CATCH mysqldao.js");
          reject(error);
         
        });
    });
  };


  var getModules = function () {
    return new Promise((resolve , reject) => {
      pool
        .query("SELECT * FROM module")
        .then((data) => {
          //console.log("THEN mysqldao.js");
          resolve(data);
        
        })
        .catch((error) => {
          console.log("CATCH mysqldao.js");
          reject(error);
         
        });
    });
  };

  

  module.exports = { getStudents, getGrades, getModules };