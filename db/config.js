const mongoose = require("mongoose");
const connectdb = async () => {
    await mongoose.connect("mongodb://localhost:27017/e-commerce")
        .then(() => { console.log("mongo is connected.....") })
        .catch((err) => { console.log("error is: " + err) })

}

connectdb();
// sk - sK9IirPDNselmws18oNbT3BlbkFJ2KIASkMPXoBCI2whv8aI