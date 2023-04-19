const encrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
       host:  process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        port:process.env.DATABASE_PORT
    });

exports.addAccount = (request,response)=>{
        
        let {username, email, password, cpassword} = request.body;
        db.query("SELECT * FROM users WHERE email = ?", email,
        async (error,result)=>{
            if (error){
                console.log("Error: "+ error);
            }
            else{
                if (result.length >0)
                    {
                        console.log(result);
                        return response.render('register',{message: "Email Already Exist"});
                    }
                else{
                
                   if(password !== cpassword){
                    // console.log(password + cpassword);
                    return response.render('register',{message: "Password Didnt Match"});
                   }
                   else{
                        const Username = username.trim();
                        const Email = email.trim();
                        const Password = password.trim();
                        const hashPassword = await encrypt.hash(Password, 8);
                        console.log(hashPassword);
                       
                        db.query("INSERT INTO users (username,email,password) VALUES ( ?, ?, ?)",
                        [Username,Email,hashPassword],
                        // db.query("INSERT INTO accounts set ", [{first_name: firstName,last_name: lastName, email:email,password}],
                        (error, result)=>{
                            if(error){
                                return console.log("Error:" +error);
                            }
                            else{
                                console.log(result);
                                return response.render('register',{message: "User Account has been Added"});
                            }
                        }
                    )
                    
                         console.log(password + cpassword);
                    
                   }
                    
                }
            }
        })
      
}

exports.loginAccount = async (request,response)=>{
    try {
        const { email , password} = request.body;
            if (email== "" || password=="")
                {
                    response.render('index',{message: "Please Completed Fields"});
                }
            else
              {
                db.query("SELECT * FROM users WHERE email = ?", email,
                    async (error, result)=>
                    {
                        console.log(result)//for test purposes
                        if(!result[0]){
                            response.render('index',{message: "Email is Incorrect"});
                        }
                        else if(!(await encrypt.compare(password, result[0].password))){
                            response.render('index',{message: "Password is Incorrect"});
                        }
                        else{
                            db.query('SELECT * FROM students', (error, result)=>
                            {
                                console.log(result)
                                if(error){
                                    console.log(`Error Message : ${error}`)
                                      }
                                else if (!result){
                                     response.render(`home`, {message: "No result found!"})
                                  }
                                   else{
                                      response.render('home', 
                                       {
                                        title: "List of Students",
                                        data: result
                                         })
                                     }
                                  })
                            // response.render('index',{message: "Login Successfully"}); 
                            console.log("Login Successfully")
                             }
                          
                    }
                    )
                    console.log(email + password)
          
                }
         
       
    } catch (error) {
        console.log("Error:" + error);
    }
}

exports.studentsList = async (request, response)=>{
    db.query('SELECT * FROM students ',
     (error, result)=>
                {
              console.log(result)
                    if(error)
                    {
                        console.log(`Error Message : ${error}`)
                    }
                    else if (!result)
                    {
                    response.render(`home`, {message: "No result found!"})
                    }
                    else
                    {
                       response.render('home', 
                            {
                            title: "List of Students",
                            data: result
                              })
                     }
          })
}

exports.courseList = async (request, response)=>{
    db.query('SELECT * FROM courses', (error, result)=>
                {
              console.log(result)
                if(error)
                {
                       console.log(`Error Message : ${error}`)
                 }
                else if (!result)
                {
                 response.render(`courses`, {message: "No result found!"})
                 }
               else{
                    response.render('courses', 
                    {
                    title: "List of Course",
                        data: result
                   })
                }
          })
}
exports.addStudent = (request,response)=>{
    // console.log(request.body);

    let firstName = request.body.first_name;
    let lastName = request.body.last_name;
    let course_id = request.body.course_id;
    let email = request.body.email;
    
    if(firstName == "" && lastName == "" && course_id == "" &&  email== "" ){
         response.render('home',{message: "PLease Completed the Field"});
    }
    
    // let {firstName, lastName, email, password, cpassword} = request.body;
    db.query("SELECT * FROM students WHERE email= ? ", 
    email,
    async (error,result)=>{
        if (error){
            console.log("Error: "+ error);
        }
        else{
            if (result.length > 0)
                {
                    console.log(result);
                    return response.render('home',{message: "Students Already Exist"});
                }
            else
            {
            
                    const firstname = firstName.toUpperCase().trim();
                    const lastname = lastName.toUpperCase().trim();
                    const Email = email.trim();
                    db.query("INSERT INTO students ( first_name, last_name,email,course_id) VALUES (?, ?, ?, ?)",
                    [firstname,lastname,Email,course_id],
                    (error, result)=>{
                        if(error){
                            return console.log("Error:" +error);
                        }
                        else{
                            db.query('SELECT * FROM students',
                            (error, result)=>
                                  {
                                  console.log(result)
                                      if(error)
                                        {
                                           console.log(`Error Message : ${error}`)
                                         }
                                        else if (!result)
                                        {
                                        response.render(`home`, {message: "No result found!"})
                                         }
                                         else
                                         {
                                            response.render('home', 
                                                {
                                                title: "List of Students",
                                                data: result,
                                                message: "User Account has been Added"
                                                    })
                                                     
                                          }
                                 })
                          
                        }
                    }
                )
                
                   
                
               
                
            }
        }
    })
  
}

exports.deleteStudent = (request,response)=>{
    const student_id = request.params.student_id

    db.query('DELETE FROM students WHERE student_id = ?', [student_id],
    (error, data) => {
        if (error) {
            console.log('Error in Delete: ' + error)
        }

        else {
            db.query('SELECT * FROM students', 
            (error, result) => {
                if (error) {
                    console.log('Error' +error)
                }
                else if (!result){
                    return response.render('home', { message: 'There is no result'})
                }
                else {
                    return response.render('home', {
                        message: `The account has been deleted with account ID of ${student_id}`, 
                        title: "List of Students",
                        data: result})
                }
            })
        }
    })
}
exports.updateStudent =(request,response)=>{
    const student_id = request.params.student_id;
    console.log(student_id);

    db.query("SELECT * FROM students WHERE student_id = ?", student_id,
    (error,data) =>{
        if(error){
            console.log(error)
        }
        else{
            response.render('home',{
                message: 'Successfully Updated',
                // title: 'Update Student Account ',
                data: data[0]
            })
        }
    }
    )
}