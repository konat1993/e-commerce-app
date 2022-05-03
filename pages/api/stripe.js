import Stripe from 'stripe'
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1KuvvULxz5JIHgyZw1mxABAT' },
          { shipping_rate: 'shr_1KuvwgLxz5JIHgyZvCGAym4W' }
        ],
        line_items: req.body.map(item => {
          const imgRef = item.image[0].asset._ref
          const newImage = imgRef.replace(
            'image-', 'https://cdn.sanity.io/images/1st5pu7b/production/'
          ).replace('-webp', '.webp')
          console.log('item.price * 100 ', parseInt(item.price * 100), 'toFixed(2): ', (item.price * 100).toFixed(0))
          return {
            price_data: {
              currency: 'pln',
              product_data: {
                name: item.name,
                images: [newImage]
              },
              unit_amount: (item.price * 100).toFixed(0)
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1
            },
            quantity: item.quantity
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancelled`,
      }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params)
      // res.redirect(303, session.url)
      res.status(200).json(session)
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}