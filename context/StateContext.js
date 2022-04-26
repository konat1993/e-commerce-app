import React from 'react'

import { toast } from 'react-hot-toast'

export const Context = React.createContext()

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = React.useState(false)
    const [cartItems, setCartItems] = React.useState([])
    const [totalPrice, setTotalPrice] = React.useState()
    const [totalQuantities, setTotalQuantities] = React.useState()
    const [qty, setQty] = React.useState(1)



    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }
    const decQty = () => {
        if (qty - 1 < 1) return
        setQty((prevQty) => prevQty - 1)
    }

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product.Id)
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)
        if (checkProductInCart) {
            const updatedCartItems = cartItems.map(cartProduct => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity

            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    React.useEffect(() => {

        return () => {
        }
    }, [])

    const state = {
        cartItems,
        showCart,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd
    }

    return (
        <Context.Provider value={{ ...state }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => {
    return React.useContext(Context)
}