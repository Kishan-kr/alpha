require("dotenv").config()
const express = require("express")
const app = express()
const conntectToDB = require("./db/connection")
const port = process.env.PORT || 5000

// Route imports
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/review');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const imageRoutes = require('./routes/images');
const { MAX_IMAGE_SIZE } = require("./utilis/constants")

//middlewares
app.use(express.json())

//routes
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/images', imageRoutes);

app.get("/", (req, res) => {
  res.send("Happy Hacking!")
})

// global error handler 
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    const sizeLimit = MAX_IMAGE_SIZE/1024/1024;
    return res.status(400).json({ error: `File too large. Max allowed size is ${sizeLimit}MB.` });
  }

  // Optional: handle other Multer errors
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected field in upload.' });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

const startServer = async () => {
  try {
    await conntectToDB();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();