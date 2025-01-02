const mongoose = require('mongoose');

//27017 for a local connection
const mongoURI = 'mongodb://localhost:27017/proj2024MongoDB';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));


// Define Schema
const LecturerSchema = new mongoose.Schema({
    _id: String,
    name: String,
    did: String,
});

//Collection name
const Lecturer = mongoose.model('lecturers', LecturerSchema);


const getAllLecturers = async () => {
    try {
        return await Lecturer.find({}).sort({ _id: 1 }); // Sort by _id in ascending order;
    } catch (err) {
        console.error('Error fetching lecturers:', err);
        throw err;
    }
};

const getLecturerById = async (lecturerId) => {
    try {
        return await Lecturer.findById(lecturerId);
    } catch (err) {
        console.error('Error fetching lecturer by ID:', err);
        throw err;
    }
};

const deleteLecturer = async (lecturerId) => {
    try {
        const result = await Lecturer.deleteOne({ _id: lecturerId }); 
        console.log(`Deleted Lecturer with ID: ${lecturerId}`);
        return result;
    } catch (err) {
        console.error('Error deleting lecturer:', err);
        throw err;
    }
};


module.exports = {getAllLecturers, deleteLecturer, getLecturerById};