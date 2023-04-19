let express = require('express');
const router = express.Router();
const register_controller = require('../controller/auth_account')

router.post('/register', register_controller.addAccount);
router.post('/login', register_controller.loginAccount);
router.post('/addStudent', register_controller.addStudent);
router.get('/students', register_controller.studentsList);
router.get('/courses', register_controller.courseList);
// Routes for edit and delete
router.get('/deleteStudent/:student_id', register_controller.deleteStudent);
router.get('/updateStudent/:student_id', register_controller.updateStudent);


module.exports = router;