import express from 'express'
import hbs from 'hbs'
import path from 'path'
import morgan from 'morgan' //menambahkan morgan
import bodyParser from 'body-parser'
//const database = require('./database')
import { initDatabase, initTable, insertProduct } from './database.js'

const __dirname = path.resolve()

const app = express()
const db = initDatabase()
initTable(db)

app.set('views', __dirname + '/layouts')
app.set('view engine', 'html')
app.engine('html',hbs.__express) // mengganti engine mengarah ke file .html

app.use(bodyParser.urlencoded())

//log incoming request menggunakan morgan
app.use(morgan('combined')) 

//serve static file
app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', (req,res,next) => {
    res.send({ success: true })
})

app.get('/', (req,res,next) => {
    res.send({ success: true })
})

app.get('/product', (req,res,next) => {
    res.render('product')
})

app.get('/add-product', (req, res, nex) => { // metode get
    res.send(req.query) //get menggunakan query
})

app.post('/add-product', (req, res, nex) => { //metode post
    console.log("Req body",req.body)
    //insert Product
    insertProduct(db, req.body.name, parseInt(req.body.price), '-')

    //redirect
    res.redirect('/product') //post menggunakan body
})


app.use((err, req, res, next) => {
    res.send(err.message)
})

app.listen(8000, () => {
    console.log('App listen on port 8000')
})