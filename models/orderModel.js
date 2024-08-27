const mongoose = require('mongoose');
const Product = require('./productModel');

const OrderSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required:true
        },

        products: {
            type: [Product.schema],
            required:true
        }, 

        totalPrice:{
          type: Number,
          required:true
        },
       
    },
    {
        timestamps:true
    }
)

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;