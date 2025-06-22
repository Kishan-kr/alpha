
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/user');
const Product = require('../../models/product');
const Order = require('../../models/order');
const OrderedProduct = require('../../models/orderedProduct');
const Category = require('../../models/category');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/alpha');

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      OrderedProduct.deleteMany({}),
      Category.deleteMany({})
    ]);

    console.log('Cleared old data');

    // 🔹 User
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      addresses: [
        {
          fullName: 'John Doe',
          line1: '101 Demo St',
          landmark: 'Greenland Model School',
          city: 'West Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India',
          phone: '9329323979',
          isDefault: true
        }
      ]
    });

    // categories
    const categories = await Category.insertMany([
      {
      name: 'Oversized T-shirt',
      slug: 'oversized-t-shirt',
      description: 'oversized fit t-shirt',
      thumbnail: 'https://picsum.photos/seed/prod1-101/800/1000',
    },
      {
      name: 'Oversized Polo',
      slug: 'oversized-polo',
      description: 'oversized fit Polo t-shirt',
      thumbnail: 'https://picsum.photos/seed/prod1-97/800/1000',
    }
  ]);

    // 🔹 Products
    const products = await Product.insertMany([
      {
        title: 'Classic Black Tee',
        categoryId: categories[0]._id,
        images: ['https://picsum.photos/seed/prod1-90/500/800', 'https://picsum.photos/seed/prod1-91/500/800'],
        thumbnail: 'https://picsum.photos/seed/prod1-90/500/800',
        originalPrice: 999,
        discountedPrice: 799,
        sizes: [
          { size: 'M', quantity: 10 },
          { size: 'L', quantity: 8 }
        ],
        colors: ['black'],
        tags: ['Oversized fit'],
        description: ['High-quality black cotton t-shirt'],
        story: 'This black tee has a legacy of comfort and simplicity.',
        adminId: null
      },
      {
        title: 'White Graphic Tee',
        categoryId: null,
        images: ['https://picsum.photos/seed/prod1-80/500/800', 'https://picsum.photos/seed/prod1-81/500/800'],
        thumbnail: 'https://picsum.photos/seed/prod1-80/500/800',
        originalPrice: 899,
        discountedPrice: 699,
        sizes: [
          { size: 'S', quantity: 15 },
          { size: 'M', quantity: 10 }
        ],
        colors: ['white'],
        description: ['Artistic print for bold expression.'],
        story: 'Wear your thoughts with our expressive graphic tees.',
        adminId: null
      },
      {
        title: 'Hooded Sweatshirt',
        categoryId: null,
        images: ['https://picsum.photos/seed/prod1-73/500/800', 'https://picsum.photos/seed/prod1-75/500/800'],
        thumbnail: 'https://picsum.photos/seed/prod1-73/500/800',
        originalPrice: 1599,
        discountedPrice: 1399,
        sizes: [
          { size: 'L', quantity: 6 },
          { size: 'XL', quantity: 5 }
        ],
        colors: ['navy'],
        tags: ['Oversized fit'],
        description: ['Warm fleece hoodie for cool weather.'],
        story: 'Comfort meets warmth in this classic hoodie.',
        adminId: null
      },
      {
        title: 'Denim Jacket',
        categoryId: null,
        images: ['https://picsum.photos/seed/prod1-65/500/800', 'https://picsum.photos/seed/prod1-67/500/800'],
        thumbnail: 'https://picsum.photos/seed/prod1-65/500/800',
        originalPrice: 1999,
        discountedPrice: 1699,
        sizes: [
          { size: 'M', quantity: 4 },
          { size: 'L', quantity: 4 },
          { size: 'XL', quantity: 4 }
        ],
        colors: ['blue'],
        description: ['Timeless denim with modern cuts.'],
        story: 'Walk in style with this all-season denim jacket.',
        adminId: null
      }
    ]);

    // 🔹 Orders
    const order1 = await Order.create({
      userId: user._id,
      shippingAddress: user.addresses[0],
      subtotal: 1598,
      discount: 100,
      tax: 100,
      deliveryFee: 50,
      totalAmount: 1648,
      currency: 'INR',
      orderStatus: 'pending',
      orderNumber: 1010
    });

    await OrderedProduct.insertMany([
      {
        orderId: order1._id,
        productId: products[0]._id,
        size: 'M',
        quantity: 1,
        originalPrice: 999,
        discountedPrice: 799,
        status: 'pending'
      },
      {
        orderId: order1._id,
        productId: products[1]._id,
        size: 'S',
        quantity: 1,
        originalPrice: 899,
        discountedPrice: 799,
        status: 'pending'
      }
    ]);

    const order2 = await Order.create({
      userId: user._id,
      shippingAddress: user.addresses[0],
      subtotal: 3598,
      discount: 200,
      tax: 200,
      deliveryFee: 0,
      totalAmount: 3598,
      currency: 'INR',
      orderStatus: 'delivered',
      orderNumber: 1011
    });

    await OrderedProduct.insertMany([
      {
        orderId: order2._id,
        productId: products[2]._id,
        size: 'L',
        quantity: 1,
        originalPrice: 1599,
        discountedPrice: 1399,
        status: 'delivered'
      },
      {
        orderId: order2._id,
        productId: products[3]._id,
        size: 'M',
        quantity: 1,
        originalPrice: 1999,
        discountedPrice: 1699,
        status: 'delivered'
      }
    ]);

    console.log('✅ Seeder completed with full schema compliance.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
};

module.exports = seedDatabase