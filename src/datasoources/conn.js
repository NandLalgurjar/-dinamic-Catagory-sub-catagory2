const mongoose = require("mongoose");

const uri = 'mongodb://localhost:27017/NiceAdmin';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
}

const connectWithDB = () => {
  mongoose.connect(uri, options, (err, db) => {
    if (err) console.error(err);
    else console.log("database connection")
  })
}
mongoose.set("strictQuery",true)
connectWithDB()








// const mongoose = require('mongoose');
// mongoose.connect(`mongodb://localhost:27017/VUEXY`,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(db => console.log('DB is connected'))
// .catch(err => console.log(err));




// mongoose.connect(`mongodb://localhost:27017/compalite`)
//   .then(() => {
//     console.log("connaction succesfull");
//   }).catch((E) => {
//     console.log("NO CONNACT", E);
//   })