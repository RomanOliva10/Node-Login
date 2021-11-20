const methodOverride = require('method-override');
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Server } = require('http');

const server = express();
server.use(cors());
server.use(methodOverride());
server.use(express.urlencoded({extended:true}))
server.use(express.json());
let PORT = process.env.PORT || 3000;
const log = console.log;


const SECRET = "pbcltnzr";
const SALT = 10;
const users = [];

server.get("/users", (req, res)=>{
   res.send(users);
});

server.get('/user/:email', (req, res) => {
    res.send(users.filter(user => user.email === req.params.email));
});


// server.get("/user/create/:nombre/:pass", (req, res)=>{
//     const nombre = req.params.nombre;
//     const pass = req.params.pass;

//     bcrypt.hash(pass, SALT, (err, hash)=>{
//        if(!err){
//           users.push({
//             nombre,
//             pass:hash 
//           });
           
//           res.json({
//               nombre,
//               pass:hash 
//           }); 
//         }
//     });
// });

server.post("/user/:email/:pass", (req, res)=>{
     const {email, pass} = req.params; 
     const user = users.find(user =>{
        if(user.email == email){
           bcrypt.compare(pass, user.pass, (err, validate)=>{
              if(!err){
                 res.send(`verify ${validate}`);
              }
           });
        }
     });
});



server.post("/user/:email/:name/:pass/:role", (req, res)=>{
    const email = req.params.email;
    const name = req.params.name;
    const pass = req.params.pass;
    const role = req.params.role;

    const payload = {
        email:email,
        name:name,
        pass:pass,
        role:role
    };
    
    bcrypt.hash(pass, SALT, (err, hash)=>{
        if(!err){
           users.push({
                email,
                name,
                pass:hash ,
                role
           });
         }
        });

    jwt.sign(payload, SECRET, (err, token)=>{
      if(!err){
        res.send(token);
      }
    });
});


// server.get("/verify", (req, res)=>{
//    const token = req.headers.authorization.split(" ")[1];
//    if(token){
//       jwt.verify(token, SECRET, (err, payload)=>{
//           if(!err){
//             res.send(payload);
//           }
//       });
//    }
// });






server.listen(PORT,()=>{
    log("start server");
});