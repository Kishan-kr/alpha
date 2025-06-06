require("dotenv").config()
const express = require("express")
const app = express()
const connect_to_db = require("./db/connect_to_db")
const port = 5000

//middlewares
app.use(express.json())

//function
connect_to_db()


//routes
app.use(require("./routes/admin"))
app.use(require("./routes/product"))
app.use(require("./routes/category"))
app.use(require("./routes/user"))
app.use(require("./routes/review"))
app.use(require("./routes/cart"))
app.use(require("./routes/order"))


app.get("/",  (req,res)=>{
     res.send("Server Started")
})

app.listen(port , ()=>{
    console.log(`Server started on port ${port}`);
})