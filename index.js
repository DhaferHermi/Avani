const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const app = express()
const port = 3000
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'password',
    database: 'avani'
})



db.connect((err) => {
    if (err) {
        throw (err);
    }
    console.log('mysql works')
})



app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(express.static('dist/my-app'));



app.get('/api', (request, response) => {
    response.json({
        info: 'Node.js, Express, and Postgres API'
    })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

app.get('/api/getData', (req, res) => {
    let sql = 'SELECT DISTINCT  * FROM avani.clients c inner join avani.dates d on (c.id = d.id);';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send(result);
    })
})

app.post('/api/postData', (req, res) => {
    let sql = 'insert into avani.clients set ?;'
    let sql2 = 'insert into avani.dates set ?;'
    let clients = req.body.clients;
    let dates = req.body.dates;

    db.query(sql, req.body.clients, (err1, result1) => {
        if (err1) {
            throw err1;
        }
        //console.log('c0', req.body.clients);
        //console.log('c1', result1);
        //console.log('c2', result1.insertId);
        res.send(result1);

        dates.forEach((date) => {
            console.log(date)
            db.query(sql2, {
                'date': date,
                'id': result1.insertId
            })
        })
    })

    console.log(res)




})