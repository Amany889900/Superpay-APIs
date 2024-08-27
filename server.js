const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Product = require('./models/productModel')
app.use(express.json())
app.use(express.urlencoded({extended: false}))
//routes

app.get('/',(req,res) =>{
    res.send('Hello NODE API')
})

app.get('/blog',(req,res) =>{
    res.send('Hello Blog. My name is Amany')
})

app.get('/products', async(req,res)=>{
    try {
       const products = await Product.find({});
       res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/products/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product); 
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/products',async(req,res)=>{
    
    try{

        const product = await Product.create(req.body)
        res.status(200).json(product);

    } catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// update a product
app.put('/products/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id,req.body);
        // we can not find any product in database
        if(!product){
            return res.status(404).json({message: `can not find any product with ID ${id}`});
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.connect('mongodb+srv://amanyehab:082003Am@orderapi.d3ybi.mongodb.net/Node-API?retryWrites=true&w=majority&appName=orderAPI')
.then(()=>{
    console.log('connected to MongoDB');
    app.listen(3000, ()=>{
        console.log('Node API app is running on port 3000')
     })
    
}).catch(()=>{
    console.log(error)
})