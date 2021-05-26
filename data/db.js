const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose
            .connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            })
    } catch (err) {
        console.log('Failed to connect to MongoDB', err)
    }
}

module.exports = connectDB
