import { Home, Info, LayoutGrid, Truck, User } from "lucide-react";

export default [
  { name: 'Home', path: '/', Icon: Home },
  { name: 'Catalog', path: '/catalog', Icon: LayoutGrid,
    children: [
      { name: 'Oversized T-Shirt', path: '/catalog/oversized-tshirt' },
      { name: 'Oversized Polos', path: '/catalog/oversized-polo' },
    ], 
  },
  { name: 'About Us', path: '/about', Icon: Info },
  { name: 'Account', path: '/account', Icon: User },
  { name: 'Track Order', path: '/track-order', Icon: Truck },
];