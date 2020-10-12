import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import hbs from 'hbs' // 
import path from 'path'
import morgan from 'morgan' //menambahkan morgan untuk menampilkan log
import bodyParser from 'body-parser' // membaca body dari POST
//const database = require('./database')
import { getProduct, initDatabase, initTable, insertProduct } from './database.js' // memanggil method
import fileUpload from 'express-fileupload' // handle upload file
import fs from 'fs' // membaca file gambar

const __dirname = path.resolve()

const app = express()
const db = initDatabase() // menggunakan method pada database.js
initTable(db)

app.set('views', __dirname + '/layouts')
app.set('view engine', 'html')
app.engine('html',hbs.__express) // mengganti engine mengarah ke file .html

//use file parser
app.use(fileUpload())

//use parser body
app.use(bodyParser.urlencoded())

//log incoming request menggunakan morgan
app.use(morgan('combined')) 

//serve static file
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/files', express.static(__dirname + '/files'))


app.get('/', (req,res,next) => {
    res.send({ success: true })
})

// get product list
// app.get('/product', (req,res,next) => {
//     const product = getProduct(db)
//     console.log('Product result', product) // asyncronus karena dijalankan duluan
//     res.render('product')
// })
app.get('/product', async (req,res,next) => {
   
    let products 
    try {
        products = await getProduct(db)
    } catch (error) {
        return next(error)
    }
    res.render('product', { products })
})

app.get('/add-product', (req, res, nex) => { // metode get
    res.send(req.query) //get menggunakan query
})

app.post('/add-product', (req, res, nex) => { //metode post
    console.log("Req body",req.body)
    console.log('File', req.files)

    // get file name
    const fileName = Date.now() + req.files.photo.name
    fs.writeFile(path.join(__dirname, '/files/', fileName),req.files.photo.data, (err) => {
        if(err){
            console.error(err)
            return
        }

         //insert Product
        insertProduct(db, req.body.name, parseInt(req.body.price), `/files/${fileName}`)

        //redirect
        res.redirect('/product') //post menggunakan body
    })
   
})


app.use((err, req, res, next) => {
    res.send(err.message)
})

// use port enviroment variable
app.listen(process.env.PORT, () => {
    console.log(`App listen on port ${process.env.PORT}`)
})