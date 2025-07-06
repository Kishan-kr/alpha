import { addItemToBagThunk } from "../store/actions/bagAction";
import { addToBag } from "../store/slices/bagSlice";
import { showBagErrorToast, showBagSuccessToast } from "./customToasts";

export const addToBagAndSync = async (item, dispatch, isLoggedIn) => {
  try {
    // Always add to Redux (local)
    dispatch(addToBag(item));

    // If not logged in → show success toast
    if (!isLoggedIn) {
      showBagSuccessToast(`${item.title} (${item.size}) added to your bag`);
      return;
    }

    // If logged in → sync to backend
    const resultAction = await dispatch(addItemToBagThunk(item));

    if (addItemToBagThunk.fulfilled.match(resultAction)) {
      toast.success(`${item.title} (${item.size}) added to your bag`);
    } else {
      showBagErrorToast("Failed to add item to bag");
    }
  } catch (err) {
    console.error("Unexpected error in bag sync:", err);
    showBagErrorToast("Something went wrong while adding to bag");
  }
};