const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Order = require('./models/orderModel');
const Payment = require('./models/paymentModel');
const User = require('./models/userModel');
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' })); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isExternalModuleNameRelative } = require('typescript');



// ORDER ROUTES

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
        res.status(200).json(order); 
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

// update an order
app.put('/orders/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const order = await Order.findByIdAndUpdate(id,req.body);
        // we can not find any order in database
        if(!order){
            return res.status(400).json({message: `can not find any order with ID ${id}`}); //400
        }
        const updatedOrder = await Order.findById(id);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// delete an order
app.delete('/orders/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const order = await Order.findByIdAndDelete(id);
        // we can not find any order in database
        if(!order){
            return res.status(400).json({message: `can not find any order with ID ${id}`});
        }
        res.status(200).json(order);
       
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// PAYMENT ROUTES


// Create a new payment
app.post('/payments', async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/payments', async(req,res)=>{
    try {
       const payments = await Payment.find({});
       res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Get payment details
app.get('/payments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(400).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update payment status
app.put('/payments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByIdAndUpdate(id, req.body, { new: true });
        if (!payment) {
            return res.status(400).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a payment
app.delete('/payments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) {
            return res.status(400).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// MIDDLEWARES

const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, 'ayHaga');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// app.use('/users',authenticate);

// LOGIN ROUTES

// Create a new user



app.post('/register', async (req, res) => {
    try {
        const { password, email } = req.body;
       
        const existingUser = await User.findOne({ email });
         if (existingUser) {
         return res.status(409).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({ password: hashedPassword, email});
        
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Msh 3arfa ana b3ml eh 
app.post('/hash-password', async (req, res) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        res.json({ hashedPassword });
    } catch (error) {
        res.status(500).json({ error: 'Error hashing password' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Retrieve user from database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('User not found');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ userId: user.id }, 'ayHaga', { expiresIn: '1h' });
            res.status(200).json({success: true, message: 'Login successful', token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});


app.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route', user: req.user });
});





app.get('/users', async(req,res)=>{
    try {
       const user = await User.find({});
       res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// TOKEN TRIAL
app.get('/user', authenticate, async (req, res) => {
    try {
        // The user object is set by the authenticate middleware
        const userId = req.user.userId; // `userId` in the JWT

        // Fetch user details from the database
        const user = await User.findById(userId).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); // return user data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get user details
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user status
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete 
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});








mongoose.connect('mongodb+srv://amanyehab:082003Am@orderapi.d3ybi.mongodb.net/Node-API?retryWrites=true&w=majority&appName=orderAPI')
.then(()=>{
    console.log('connected to MongoDB');
    app.listen(3000, ()=>{
        console.log('Node API app is running on port 3000')
     })
    
}).catch(()=>{
    console.log(error);
})