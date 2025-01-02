var express = require('express')
let ejs = require('ejs')
var mySqlDao = require('./mySqlDao')
var myMongoDB = require('./myMongoDB')
var bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');


var app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}))

app.listen(3004, () => {
console.log("Server is running on port 3004")
})


app.get("/", (req, res) => {
    res.send(`
        <h1>G00400975</h1>
        <ul>
            <li><a href="/students">Students Page</a></li>
            <li><a href="/grades">Grades Page</a></li>
            <li><a href="/lecturers">Lecturer Page</a></li>
        </ul>
    `);
    

});


app.get("/students", (req, res) => {
    mySqlDao.getStudents()
    .then((data)=> {
        //console.log(JSON.stringify(data))
        //res.send(data)
        res.render("students",{"theStudents": data})
    })

    .catch((error) => {
        console.log("catch index.js")
    })
    //console.log("pool error: "+ error)
});


app.get("/students/edit/:sid", (req,res)=>{
    mySqlDao.getStudentById(req.params.sid) 
    .then((student) => {
        res.render("updateStudent", { student }); 
    })
    .catch((error) => {
        console.error("Error fetching student:", error);
    });

});

app.post("/students/edit/:sid",  (req, res) => {
    
    const updatedStudent = {
        sid: req.params.sid,
        name: req.body.name,
        age: req.body.age,
    };

    mySqlDao.editStudent(updatedStudent) 
        .then(() => {
            res.redirect("/students"); // Redirect to the students list after updating
        })
        .catch((error) => {
            console.error("Error updating student:", error);
        });
});

app.get("/students/add", (req, res) => {
    res.render('addStudent', { errors: [], student: { sid: '', name: '', age: '' } });

});

app.post('/students/add',async (req, res) => {

    

    try {
        const studentId = req.body.sid;

        // Check if the Student ID already exists
        const existingStudent = await mySqlDao.getStudentById(studentId);

        if (existingStudent) {
            // If the Student ID exists, show an error message
            return res.render('addStudent', {
                error: `A student with ID ${studentId} already exists`,
                student: req.body, // Retain entered data
            });
        }else{

        // Add the student to the database
        const newStudent = {
            sid: req.body.sid,
            name: req.body.name,
            age: req.body.age,
        };

        await mySqlDao.addStudent(newStudent);

        res.redirect('/students'); // Redirect to students list after adding
    }
    } catch (err) {
        console.error('Error adding student:', err);
        
    }

});

app.get("/grades", (req, res) => {
    // Fetch all data using Promise.all
    Promise.all([
        mySqlDao.getStudents(),
        mySqlDao.getGrades(),
        mySqlDao.getModules()
    ])

    .then(([students, grades, modules]) => {
        // Process the data
        const gradesData = students.map((student) => {
            // Find grades for this student
            const studentGrades = grades.filter((grade) => grade.sid === student.sid);

            // Map the grades to their corresponding module names
            const studentModules = studentGrades.map((grade) => {
                const module = modules.find((mod) => mod.mid === grade.mid);
                return {
                    module_name: module ? module.name : "Unknown Module",
                    grade: grade.grade,
                };
            });

            return {
                student_name: student.name,
                modules: studentModules,
            };
        });

        // Sort students alphabetically by name
        gradesData.sort((a, b) => a.student_name.localeCompare(b.student_name));

        // Sort each student's modules by grade (ascending)
        gradesData.forEach((student) => {
            student.modules.sort((m1, m2) => m1.grade - m2.grade);
        });

        // Render the Grades Page
        res.render("grades", { gradesData });
    })
    .catch((error) => {
        console.error("Catch index.js:", error.message);
    });
});

app.get('/lecturers', async (req, res) => {
    try {
        const lecturers = await myMongoDB.getAllLecturers(); // Fetch all lecturers
        res.render('lecturers', { lecturers });
    } catch (err) {
        console.error('Error fetching lecturers:', err);
    }
});

app.get("/lecturers/delete/:lid", async (req, res) => {
  try {
    const lecturerId = req.params.lid;

    // Check if the lecturer teaches any module
    const modules = await mySqlDao.getModulesByLecturerId(lecturerId);

    const lecturer = await myMongoDB.getLecturerById(lecturerId);

    if (!lecturer) {
        return res.status(404).send('Lecturer not found.');
    }

    if (modules.length > 0) {
      // Render the delete page with an error message if they teach a module
      return res.render("deleteLecturer", {
        lecturer,
        error:
          "Cannot delete lecturer because they are assigned to one or more modules.",
      }); 
      }else {
        res.render('deleteLecturer', {
            lecturer,
            error: null,
        });
    }
  } catch (err) {
    console.error("Error fetching lecturer or module", err);
  }
});

app.post('/lecturers/delete/:lid', async (req, res) => {
    try {
        const lecturerId = req.params.lid;
        await myMongoDB.deleteLecturer(lecturerId); 
        res.redirect('/lecturers'); 
    } catch (err) {
        console.error('Error deleting lecturer:', err);
    }
});
