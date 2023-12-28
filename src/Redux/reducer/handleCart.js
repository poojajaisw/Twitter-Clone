const initialState = []; //  initial state

const handleCart = (state = initialState, action) => {
  const product = action.payload;

  switch (action.type) {
    case "ADDITEM":
      // Checking if Product is Already Exist
      const existingProduct = state.find((x) => x.customId === product.customId);

      if (existingProduct) {
        // If the product already exists, update the quantity
        const updatedState = state.map((item) =>
          item.customId === existingProduct.customId
            ? { ...item, qty: item.qty + 1 }
            : item
        );

        return updatedState;
      } else {
        // If the product doesn't exist, add it with qty: 1
        return [
          ...state,
          {
            ...product,
            qty: 1,
          },
        ];
      }

    case "DELITEM":
      const exist1 = state.find((x) => x.customId === product.customId);

      if (exist1.qty === 1) {
       
        return state.filter((x) => x.customId !== exist1.customId);
      } else {
       
        return state.map((x) =>
          x.customId === product.customId ? { ...x, qty: x.qty - 1 } : x
        );
      }

    case "INCITEM":
      return state.map((x) =>
        x.customId === product.customId ? { ...x, qty: x.qty + 1 } : x
      );

    case "DECITEM":
      
      return state.map((x) =>
        x.customId === product.customId ? { ...x, qty: Math.max(x.qty - 1, 1) } : x
      );

    default:
      return state;
  }
};

export default handleCart;
