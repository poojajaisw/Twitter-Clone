// For Add Item to Cart
export const addCart = (product) => {
  return {
    type: "ADDITEM",
    payload: {
      customId: product.customId,
      name: product.name,
      price: product.price,
      image: product.image,
      
    },
  };
};

// For Delete Item From Cart
export const delCart = (product) => {
  return {
    type: "DELITEM",
    payload: {
      customId: product.customId,
      name: product.name,
      price: product.price,
      image: product.image,
  
    },
  };
};

// For Remove Item From Cart (if needed)
export const removeCart = (product) => {
  return {
    type: "REMOVEITEM",  // Adjust this to your actual action type
    payload: {
      customId: product.customId,
   
    },
  };
};

// For Increment Item Quantity
export const incItem = (product) => {
  return {
    type: "INCITEM",
    payload: {
      customId: product.customId,
    
    },
  };
};

// For Decrement Item Quantity
export const decItem = (product) => {
  return {
    type: "DECITEM",
    payload: {
      customId: product.customId,
    
    },
  };
};
