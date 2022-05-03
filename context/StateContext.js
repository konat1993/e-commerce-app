import React from 'react'

import { toast } from 'react-hot-toast'

export const Context = React.createContext()

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = React.useState(false)
    const [cartItems, setCartItems] = React.useState([])
    const [totalPrice, setTotalPrice] = React.useState(0)
    const [totalQuantities, setTotalQuantities] = React.useState(0)
    const [qty, setQty] = React.useState(1)

    let newCartItems

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }
    const decQty = () => {
        if (qty - 1 < 1) return
        setQty((prevQty) => prevQty - 1)
    }

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id)
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)
        if (checkProductInCart) {
            const updatedCartItems = cartItems.map(cartProduct => {
                if (cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity
                    }
                } else {
                    return {
                        ...cartProduct
                    }
                }
            })
            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity

            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const onRemove = (product) => {
        const filterCartItems = cartItems.filter(item => item._id !== product._id)
        setTotalPrice(prevTotalPrice => prevTotalPrice - product.price * product.quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - product.quantity)
        setCartItems(filterCartItems)
    }

    const toggleCartItemQuantity = (id, value) => {
        newCartItems = cartItems.map((item) => {
            if (item._id === id) {
                if (value === 'inc') {
                    setTotalPrice(prevTotalPrice => prevTotalPrice + item.price)
                    setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
                    return {
                        ...item,
                        quantity: item.quantity + 1
                    }
                } else if (value === 'dec' && item.quantity > 1) {
                    setTotalPrice(prevTotalPrice => prevTotalPrice - item.price)
                    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
                    return {
                        ...item,
                        quantity: item.quantity - 1
                    }
                } else return item
            } else return item

        })
        setCartItems(newCartItems)
    }

    const state = {
        cartItems,
        setCartItems,
        showCart,
        setShowCart,
        totalPrice,
        totalQuantities,
        setTotalPrice,
        setTotalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove
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