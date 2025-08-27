import { Home, Info, LayoutGrid, Package, Store, Truck, User } from "lucide-react";

export default [
  { name: 'Home', path: '/', Icon: Home },
  { name: 'Collections', path: '/collections', Icon: LayoutGrid,
    children: [
      { name: 'Oversized T-Shirt', path: '/collections/oversized-t-shirt' },
      // { name: 'Oversized Polos', path: '/collections/oversized-polo' },
    ],
  },
  { name: 'Shop', path: '/products', Icon: Store },
  { name: 'Orders', path: '/orders', Icon: Package },
  { name: 'About Us', path: '/about', Icon: Info },
];