import { Home, Info, LayoutGrid, Truck, User } from "lucide-react";

export default [
  { name: 'Home', path: '/', Icon: Home },
  { name: 'Collections', path: '/collections', Icon: LayoutGrid,
    children: [
      { name: 'Oversized T-Shirt', path: '/collections/oversized-t-shirt' },
      // { name: 'Oversized Polos', path: '/collections/oversized-polo' },
    ],
  },
  { name: 'About Us', path: '/about', Icon: Info },
  { name: 'Account', path: '/account', Icon: User },
  { name: 'Track Order', path: '/track-order', Icon: Truck },
];