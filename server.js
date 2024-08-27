const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Order = require('./models/orderModel')
app.use(express.json())
app.use(express.urlencoded({extended: false}))
//routes

app.get('/orders', async(req,res)=>{
    try {
       const orders = await Order.find({});
       res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/orders/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const order = await Order.findById(id);
        res.status(200).json(product); 
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/orders',async(req,res)=>{
    
    try{

        const order = await Order.create(req.body)
        res.status(200).json(order);

    } catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// update a product
app.put('/products/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const order = await Order.findByIdAndUpdate(id,req.body);
        // we can not find any order in database
        if(!order){
            return res.status(404).json({message: `can not find any order with ID ${id}`});
        }
        const updatedOrder = await Order.findById(id);
        res.status(200).json(updatedOrder);
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