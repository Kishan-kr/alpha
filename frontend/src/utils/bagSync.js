import { BAG_QUANTITY_UPDATE_DELAY } from "../constants/appConstants";
import { addItemToBagThunk, removeItemFromBagThunk, updateBagItemThunk } from "../store/actions/bagAction";
import { addToBag, removeFromBag, updateQuantity } from "../store/slices/bagSlice";
import { showErrorToastWithIcon, showBagSuccessToast } from "./customToasts";
import { debounce } from "./debounce";

// keep one debounced function reference
const debouncedUpdateApi = debounce(async (item, dispatch) => {
  const resultAction = await dispatch(updateBagItemThunk(item));

  if (!updateBagItemThunk.fulfilled.match(resultAction)) {
    showErrorToastWithIcon("Failed to update quantity on server");
  }
}, BAG_QUANTITY_UPDATE_DELAY);

export const addToBagAndSync = async (item, dispatch, isLoggedIn) => {
  try {
    if (isLoggedIn) {
      const resultAction = await dispatch(addItemToBagThunk(item));

      if (resultAction.meta.requestStatus === 'rejected') {
        const error = resultAction.payload || "Failed to add item to bag";
        showErrorToastWithIcon(error);
        return;
      }
    }

    dispatch(addToBag(item));
    showBagSuccessToast(`${item.title} (${item.size}) added to your bag`);

  } catch (err) {
    console.error("Unexpected error in bag sync:", err);
    showErrorToastWithIcon("Something went wrong while adding to bag");
  }
};


// update Quantity of an item in bag 
// required props of item : { productId, _id, size, color, quantity }
export const updateBagItemQuantityAndSync = (item, dispatch, isLoggedIn) => {
  try {
    // Debounced API sync
    if (isLoggedIn) {
      debouncedUpdateApi(item, dispatch);
    }
    
    // Optimistic UI update
    dispatch(updateQuantity(item));

  } catch (err) {
    console.error("Unexpected error in bag update sync:", err);
    showErrorToastWithIcon("Something went wrong while updating the bag");
  }
};


export const removeBagItemAndSync = async (item, dispatch, isLoggedIn) => {
  try {
    if (isLoggedIn) {
      const resultAction = await dispatch(removeItemFromBagThunk(item?._id));

      if (!removeItemFromBagThunk.fulfilled.match(resultAction)) {
        showErrorToastWithIcon("Failed to remove item from bag");
        return;
      }
    }

    dispatch(removeFromBag(item));
    showBagSuccessToast(`${item.title} (${item.size}) removed from your bag`);
  } catch (err) {
    console.error("Unexpected error in bag removal sync:", err);
    showErrorToastWithIcon("Something went wrong while removing the item");
  }
};


export const clearBagAndSync = async (dispatch, isLoggedIn) => {
  try {
    if (isLoggedIn) {
      const resultAction = await dispatch(clearBagThunk());

      if (!clearBagThunk.fulfilled.match(resultAction)) {
        showErrorToastWithIcon("Failed to clear your bag");
        return;
      }
    }

    dispatch(clearBag());
    showBagSuccessToast("Your bag has been cleared");
  } catch (err) {
    console.error("Unexpected error in bag clear sync:", err);
    showErrorToastWithIcon("Something went wrong while clearing the bag");
  }
};