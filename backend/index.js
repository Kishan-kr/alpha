require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const conntectToDB = require("./db/connection")
const session = require('express-session');
const MongoStore = require('connect-mongo');
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
const testimonialRoutes = require('./routes/testimonials');
const lookbooksRoutes = require('./routes/lookbookVideo');
const { MAX_IMAGE_SIZE } = require("./utils/constants")

// Session config
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DATABASE_URI,
  collectionName: 'sessions',
  ttl: parseInt(process.env.SESSION_TTL_SECONDS || String(60 * 60 * 24)), // default 1 day
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // don't set cookie until something stored
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // send only over HTTPS in prod
    sameSite: process.env.SESSION_SAMESITE || 'lax', // consider 'strict' if appropriate
    maxAge: parseInt(process.env.SESSION_MAXAGE_MS || String(24 * 60 * 60 * 1000)), // 1 day default
  }
}));

// Get allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition']
};

app.use(cors(corsOptions));

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
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/lookbooks', lookbooksRoutes);

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