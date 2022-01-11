const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name:{
        type:String,
    },
    lastname:{
        type:String,
    },
    mobile:{
        type:String,
        minlength:[10, 'Minimum length should be 10 numbers']
    },
    email:{
        type:String,
        required:[true, 'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true, 'Please enter a Password'],
        minlength:[6, 'Minimum password length is 6 characters']
    }
})

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
}

module.exports = mongoose.model('User',userSchema);