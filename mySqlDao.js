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

  var getStudentById = function (sid) {
    return new Promise((resolve, reject) => {
        pool
            .query("SELECT * FROM student WHERE sid = ?", [sid])
            .then((data) => {
                console.log("THEN mysqldao.js - getStudentById");
                resolve(data[0]); // Assuming sid is unique, return the first result
            })
            .catch((error) => {
                console.log("CATCH mysqldao.js - getStudentById");
                reject(error);
            });
    });
};

  var editStudent = function (student) {
    return new Promise((resolve, reject) => {
      pool
        .query("UPDATE student SET name = ?, age = ? WHERE sid = ?",
           [student.name, student.age, student.sid])
        .then((data) => {
          console.log("THEN mysqldao.js - updateStudent");
          resolve(data);
        })
        .catch((error) => {
          console.log("CATCH mysqldao.js - updateStudent");
          reject(error);
        });
    });
  };

  var addStudent = function (student) {
    return new Promise((resolve, reject) => {
        pool
            .query("INSERT INTO student (sid, name, age) VALUES (?, ?, ?)", [student.sid, student.name, student.age])
            .then((data) => {
                console.log("THEN mysqldao.js - addStudent");
                resolve(data);
            })
            .catch((error) => {
                console.log("CATCH mysqldao.js - addStudent");
                reject(error);
            });
    });
};

  

  module.exports = { getStudents, getGrades, getModules, editStudent , getStudentById, addStudent };