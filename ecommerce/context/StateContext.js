import React, {createContext, useContext, useState, useEffect} from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();
if (typeof window !== 'undefined') {
    //here `window` is available
    var cartFromLocalStorage = JSON.parse(window.localStorage.getItem('cart' || '[]'));
    var quantitiesFromLocalStorage = JSON.parse(window.localStorage.getItem('quantities' || '0'));
    
  }

export const StateContext = ({ children }) => {
    let quantitiesLStoNumber = parseInt(quantitiesFromLocalStorage);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState(cartFromLocalStorage);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);
    console.log(quantitiesFromLocalStorage)

    let foundProduct;
    let index;
    useEffect(() =>{
        window.localStorage.setItem('cart', JSON.stringify(cartItems))
        window.localStorage.setItem('quantities', JSON.stringify(totalQuantities))
    },[cartItems])
    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id )
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity)

        if(checkProductInCart){
            const updatedCartItems = cartItems.map(cartProduct => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product}])
            window.localStorage.removeItem('cart')
            window.localStorage.setItem('cart',JSON.stringify(cartItems)) 
        }
        toast.success(`${qty} ${product.name} added to the cart.`);       
        
    }

    const toggleCartItemQuantity = (id, value) =>{
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex(product => product._id === id);
        const newCartItems = cartItems

        if(value === 'inc'){
            newCartItems.splice(index, 1, {
                ...foundProduct,
                quantity: foundProduct.quantity + 1,
              });
            setTotalPrice(prevTotalPrice => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        }else if( value === 'dec'){
            if(foundProduct.quantity > 1){
                newCartItems.splice(index, 1, {
                    ...foundProduct,
                    quantity: foundProduct.quantity - 1,
                  });
                setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
        setCartItems(newCartItems)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)
        const newCartItems = cartItems.filter(item => item._id !== product._id);

        setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity)
        setCartItems(newCartItems)
        window.localStorage.removeItem('cart');
        
    }
    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
        }

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;
            
            return prevQty - 1;
        });
        }

    return (
        <Context.Provider 
            value={{
                showCart,
                cartItems,
                setShowCart,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)