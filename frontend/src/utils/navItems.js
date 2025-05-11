export default [
  { name: 'Home', path: '/' },
  { name: 'Catalog', path: '/catalog', 
    children: [
      { name: 'Oversized T-Shirt', path: '/catalog/oversized-tshirt' },
      { name: 'Oversized Polos', path: '/catalog/oversized-polo' },
    ], 
  },
  { name: 'About Us', path: '/about' },
  { name: 'Account', path: '/account' },
  { name: 'Track Order', path: '/track-order' },
];