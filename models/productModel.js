const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
