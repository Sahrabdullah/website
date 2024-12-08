const express = require('express')
const server = express()
const db_access = require('./db.js')
const db = db_access.db
const port = 127
server.use(express.json()) //instead of using body parser

//REGISTERATION
server.post(`/user/register`, (req, res) => 
{ //req body
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const user_role = req.body.user_role
    const content = `INSERT INTO USERS (NAME,EMAIL,PASSWORD,USER_ROLE, ISADMIN) 
                VALUES ('${name}', '${email}','${password}', '${user_role}',0)`
    db.run(content, (err) => {
        if (err) {
            console.log(err.message)
            return res.status(401).send
        }
        else
            return res.status(200).send(`Registered Successfully`)
    })
})


//LOGIN
server.post(`/user/login`, (req, res) => 
{ //req body
    // const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    db.get(`SELECT * FROM USER WHERE EMAIL= '${email}' AND PASSWORD = '${password}' `, (err, row) => {
        if (err || !row)
            return res.status(401).send(`Fail to Login`) //401 is unauthorized user
        else
            return res.status(201).send(`Login Successfull`)  //201 is created
    })
})

//GET ALL CARS
server.get(`/cars`, (req, res) => 
{ //req body
    const car = `SELECT * FROM CARS`
    db.all(car, (err, rows) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else
            return res.json(rows)
    })
})

//SEARCH CAR BY ID 
server.get(`/cars/:id`, (req, res) => 
{ //route params
    const car = `SELECT * FROM CARS WHERE ID =${req.params.id}`
    db.get(car, (err, rows) => {
        if (err) { //send the error
            console.log(err)
            return res.send(err)
        }
        else if (!rows) {  //not found id
            return res.status(404).send(`THE CAR WITH ID ${req.params.id} IS NOT FOUND`) //404 not found
        }
        else //successful 
            return res.json(rows)
    })
})

