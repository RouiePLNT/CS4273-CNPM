
const mongoose = require('mongoose')


async function connect()
{   
    try{
        //await mongoose.connect('mongodb://localhost/my_database')

        await mongoose.connect('mongodb+srv://Phuong:phuongne@cluster0.gmivy.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connect Success") 
    }
    catch(error){
        console.log("Connect fail") 
    }
    
}

module.exports = { connect }