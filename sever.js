const express = require('express')
const server = express()
const db_access = require('./db.js')
const db = db_access.db
const port = 127
server.use(express.json()) //instead of using body parser

//REGISTERATION
server.post(`/user/register`, (req, res) => { //req body
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const user_role = req.body.user_role
    const content = `INSERT INTO USERS (NAME,EMAIL,PASSWORD,USER_ROLE, ISADMIN) 
                VALUES ('${name}', '${email}','${password}', '${user_role}',0)`
    db.run(content, (err) => {
        if (err) {
            console.log(err.message)
            return res.status(401).send     //401 is unauthorized user
        }
        else
            return res.status(200).send(`Registered Successfully`)      //20 is OK
    })
})


//LOGIN
server.post(`/user/login`, (req, res) => { //req body
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

//DELETE USER
server.delete(`/user/delete/:id`,(req,res)=>{
     const user = `DELETE FROM USERS WHERE ID = ${req.params.id}`
     db.run(user, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else
            return res.json(`The user with the id ${req.params.id} is deleted`)
    })
})



//GET ALL CARS
server.get(`/cars`, (req, res) => { //req body
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
//ROUTE PARAMS
server.get(`/cars/:id`, (req, res) => { //route params
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

//ADD CARS
server.post(`/cars/addcars`, (req, res) => {
    const brand = req.body.brand
    const model = req.body.model
    const km = req.body.km
    const price = req.body.price
    const email = req.body.email
    let cars = `INSERT INTO CARS (BRAND,MODEL,KM,min,max,email)
        VALUES('${brand}','${model}','${km}',${price},'${email}') `
    db.run(cars, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else
            return res.json(`car added successfully`)
    })
})

//DELETE CARS
//ROUTE PARAMS
//-- ADMIN
server.delete(`/cars/deletecar/:id`, (req, res) => {
    const car = `DELETE FROM CARS WHERE ID = ${req.params.id}`
    db.run(car, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else
            return res.json(`Car with the id ${req.params.id} is deleted`)
    })
})

//EDIT CAR
// -- ADMIN
server.put(`/cars/edit/:id`, (req, res) => {
    const brand = req.body.brand
    const model = req.body.model
    const price = req.body.price
    const km = req.body.km

    const query = `UPDATE CARS SET BRAND= '${brand}',MODEL= '${model}',PRICE= ${price},KM= '${km}' WHERE ID= ${req.params.id}`
    db.run(query, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else
            return res.json(`Car with the id ${req.params.id} is updated successfully`)
    })
})

// ADD REVIEW
/////////////////////////////////////////////////////////////////////DOC HOW TO SAY TO GET FROM DATABASE
server.post(`/addreview`, (req, res) => {
    const user_id = req.users.id
    const review = req.body.review

    const reviews = `INSERT INTO REVIEWS (USER_ID,REVIEW) VALUES (${user_id}, '${review}')`
    db.run(reviews, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else
            return res.json(`Thank You For Your Review`)
    })
})

//DELETE REVIEW
// -- ADMIN
server.delete(`/deletereview/:id`, (req, res) => {
    const car = `DELETE FROM REVIEWS WHERE ID = ${req.params.id}`
    db.run(car, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else
            return res.json(`Review with the id ${req.params.id} is deleted`)
    })
})

server.get(`/booking`,(req, res) => {
    const bookings = `SELECT * FROM BOOKING`
    db.all(bookings, (err, rows) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else
            return res.json(rows)
    })
})


server.delete(`/delete/book/:id`,(req,res)=>{
    const books = `DELETE FROM BOOKING WHERE ID = ${req.params.id}`
    db.run(books, (err) => {
       if (err) {
           console.log(err)
           return res.send(err)
       }
       else
           return res.json(`The user with the id ${req.params.id} is deleted`)
   })
})
server.listen(port, (error) => {
    if (error) {
        console.log(`The server did not start:`, error)
        return
    }
    console.log(`The server is listing to port ${port}`)
    db.serialize(() => {
        db.exec(db_access.create_users_table)
        db.exec(db_access.create_user_booking_table)
        db.exec(db_access.create_feedback_table)
        db.exec(db_access.create_cars_table)
    })
