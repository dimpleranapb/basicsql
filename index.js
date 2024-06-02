const { faker } = require('@faker-js/faker');
const express =  require ("express");
const app = express();
const mysql = require ("mysql2");
const { v4: uuidv4 } = require('uuid'); // Import UUID generator


const methodOverride = require ("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true }));

const path = require("path");
app.set("view engne", "ejs");
app.set("views", path.join(__dirname, "views"));

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'ranapbx2002'
  });





//home route
app.get ("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
      connection.query(q, (err, result) =>{
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
  });
  } catch(err) {
    console.log(err);
    res.send("some error in DB")
  }
})

//Show users route

app.get("/user", (req, res) =>{
  let q = "select * from user";
  try {
    connection.query(q, (err, users) =>{
    if (err) throw err;
    res.render("showUsers.ejs", { users });
  });
} catch(err) {
  console.log(err);
  res.send("some error in DB")
}
})

//Edit route
app.get ("/user/:id/edit", (req , res) =>{
  let {id} = req.params;
  let query = `SELECT * FROM user WHERE id = "${id}"`;


  try {
    connection.query(query, (err, result) =>{
    if (err) throw err;
    let user = (result[0]);
    res.render("edit.ejs", { user });

  });
} catch(err) {
  console.log(err);
  res.send("some error in DB")
}
});



//UPDATE ROUTE
app.patch("/user/:id", (req, res) => {
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let query = `SELECT * FROM user WHERE id = "${id}"`;


  try {
    connection.query(query, (err, result) =>{
    if (err) throw err;
    let user = (result[0]);
    if(formPass != user.password){
      res.send("wrong password");
    }else{
      let q2 = `UPDATE user SET username = "${newUsername}" Where id = "${id}"`;
      connection.query(q2, (err, result) =>{
        if (err) throw err;
        res.redirect("/user");

      });
    }
  });
} catch(err) {
  console.log(err);
  res.send("some error in DB")
}
})



//Add new User Route

app.get("/newuser", (req, res) => {
  res.render("newuser.ejs");
});

app.post("/newuser", (req, res) =>{
  let{username, email, password} = req.body;
  let id = uuidv4();
  let q = "INSERT INTO user (id, username, email, password) VALUES (?,?, ?, ?)";
  let values = [id, username, email, password]; // Array of values to insert into the query


  connection.query(q, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.send("Error adding new user to the database");
    }else{
    console.log("New user added successfully");
    // Redirect to a different page or render a success message
    res.redirect("/User.ejs");
  }
});

  });


app.get("/user/:id/delete", (req, res) =>{
  let {id} = req.params;
  res.render("delete.ejs",{ id });
})

app.delete("/user/:id" ,(req, res) => {
  let {password: formPass, email: formEmail} = req.body;
  let query = `SELECT * FROM user WHERE email = "${formEmail}";`;

  
  try {
    connection.query(query, (err, result) =>{
    if (err) throw err;
    let user = (result[0]);
    if (!user) {
      return res.send("User not found");
    }
    console.log(user);
    if(formPass != user.password){
      res.send("wrong password");
    }else{
      let q2 = `DELETE FROM user WHERE email = "${formEmail}";`;
      connection.query(q2, (err, result) =>{
        if (err) throw err;
        res.redirect("/user");

      });
    }
  });
} catch(err) {
  console.log(err);
  res.send("some error in DB")
}



});








app.listen("8080", ()=> {
  console.log("server is running")
})


























// let getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),

//   ];
// }


// //inserting new data
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// // let users = [
// //   ["123b", "123_newuserb", "abc@gmail.comb", "abcb"],
// //   ["123c", "123_newuserc", "abcc@gmail.com", "abcc"],
// // ];

// let data = [];
// for (let i = 0; i<=100; i++){
//   data.push(getRandomUser());// 100 fake users
// }

// try {
//   connection.query(q, [data], (err, result) =>{
//     if (err) throw err;
//     console.log(result);
// });
// } catch(err) {
//   console.log(err);
// }
// connection.end();