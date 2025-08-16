// middleware/ensureDefaultAddress.js
export const ensureDefaultAddress = (req, res, next) => {
  const addresses = req.body;

  if (!Array.isArray(addresses) || addresses.length === 0) {
    return res.status(400).json({ status: false, error: "Addresses must be a non-empty array" });
  }

  if (addresses.length === 1) {
    // If only one address, force it to default
    addresses[0].isDefault = true;
  } else {
    // If multiple addresses, ensure only one is marked as default
    let defaultCount = addresses.filter(addr => addr.isDefault).length;

    if (defaultCount === 0) {
      // If none marked default, set the first one as default
      addresses[0].isDefault = true;
    } else if (defaultCount > 1) {
      // If more than one marked default, keep the first and unmark the rest
      let found = false;
      for (let addr of addresses) {
        if (addr.isDefault) {
          if (!found) {
            found = true;
          } else {
            addr.isDefault = false;
          }
        }
      }
    }
  }

  req.body = addresses;
  next();
};