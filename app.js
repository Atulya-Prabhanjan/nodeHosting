const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require("cors");
const port = 5000;
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'rds-postgres-tarp.cdohjak6feob.eu-north-1.rds.amazonaws.com',
    database: 'postgres',
    password: 'Tarp1234',
    port: 5432,
  });
app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.static('public'));

app.listen(port, (error) => {
    if(error)
        console.log('error: '+error);
    else
        console.log('Up and Running!');
});

app.get('/',getMenu);
app.post('/ngo',registerNgo);
app.post('/hotel',hotel);
app.post('/menu',menu);

function getMenu(request, response) {
    let name = request.query.name;
    console.log("name: "+name);
    console.log("Query: SELECT * FROM hotel WHERE hotelname ='"+name.replace('"','').replace('"','')+"';");
    pool.query("SELECT * FROM hotel WHERE hotelname ='"+name.replace('"','').replace('"','')+"';", (error, results) => {
        if (error) {
            throw error;
        }
        console.log(results.rows);
        response.status(200).json(results.rows);
    })
}

function registerNgo(request, response) {
    let req = request.body;
    let nname = req.name;
    let email = req.email;
    let number = req.number;
    let address = req.address;
    pool.query("INSERT INTO ngo(ngoname,email,number,address) VALUES('"+nname+"','"+email+"','"+number+"','"+address+"');", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
}

function hotel(request, response) {
    let req = request.body;
    let hname = req.name;
    let email = req.email;
    let number = req.number;
    let address = req.address;
    let menu ='{';
    for(i in req.menu){
        menu=menu+'{'+JSON.stringify(req.menu[i][0])+','+JSON.stringify(req.menu[i][1])+'}';
        if(i<req.menu.length-1)
            menu=menu+',';
    };
    menu = menu+'}';
    pool.query("INSERT INTO hotel(hotelname,email,number,address,menu) VALUES('"+hname+"','"+email+"','"+number+"','"+address+"','"+menu+"');", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

function menu(request, response) {
    let req = request.body;
    let hname = req.name;
    let email = req.email;
    let number = req.number;
    let menu ='{';
    for(i in req.menu){
        menu=menu+'{'+JSON.stringify(req.menu[i][0])+','+JSON.stringify(req.menu[i][1])+'}';
        if(i<req.menu.length-1)
            menu=menu+',';
    };
    menu = menu+'}';
    pool.query("UPDATE hotel SET menu = '"+menu+"' WHERE hotelname = '"+hname+"' and email = '"+email+"' and number = '"+number+"';", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}