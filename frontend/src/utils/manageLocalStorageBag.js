const BAG_KEY = 'bag_items';

// Load bag from localStorage
export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(BAG_KEY);
    const items = data ? JSON.parse(data) : [];
    return {
      items,
      status: 'idle',
      error: null,
    };
  } catch (e) {
    console.error("Could not load bag from localStorage:", e);
    return {
      items: [],
      status: 'idle',
      error: null,
    };
  }
};

// Save bag to localStorage
export const saveToLocalStorage = (bag) => {
  try {
    const items = bag.items;
    localStorage.setItem(BAG_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Could not save bag to localStorage:", e);
  }
};