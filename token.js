const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export const generateToken = (user) => {
    return jwt.sign({ id: user._id }, 'ayHaga', { expiresIn: '1h' });
};
