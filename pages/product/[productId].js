import React from 'react'
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai"
import { client, urlFor } from '../../lib/client'
import { Product } from '../../components'
import { useStateContext } from '../../context/StateContext'

const ProductDetails = ({ product, allProducts }) => {
  const { incQty, decQty, qty, onAdd } = useStateContext()
  const [index, setIndex] = React.useState(0)
  const { image, name, details, price } = product
  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              alt="productImage"
              className='product-detail-image'
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => {
              console.log('itttttt ', item)
              return (<img
                key={i}
                src={urlFor(item)}
                alt="anotherImages"
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
              />)
            })}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className="num" >{qty}</span>
              <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="buttons">
            <button type='button' className='add-to-cart' onClick={() => onAdd(product, qty)}>
              Add to Cart
            </button>
            <button type='button' className='buy-now' onClick={''}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {allProducts.map(item => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps = async ({ params }) => {
  const productQuery = `*[_type == "product" && slug.current == '${params.productId}']`
  const product = await client.fetch(productQuery)
  const allProductsQuery = `*[_type == "product"]`
  const allProducts = await client.fetch(allProductsQuery)
  return {
    props: {
      product: product[0],
      allProducts: allProducts
    }
  }
}
export const getStaticPaths = async () => {
  const allProductQuery = `*[_type == "product"]{
    slug{
      current
    }
  }`
  const products = await client.fetch(allProductQuery)

  const paths = products.map(product => {
    return { params: { productId: product.slug.current } }
  })
  return {
    paths: paths,
    fallback: 'blocking'
  }
}

export default ProductDetails