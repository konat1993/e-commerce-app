import { loadStripe } from "@stripe/stripe-js"

const STRIPE_PB_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

let stripePromise

 const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PB_KEY)
    }

    return stripePromise
}

export default getStripe