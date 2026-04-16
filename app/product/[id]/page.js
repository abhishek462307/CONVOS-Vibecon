'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ShoppingCart, Sparkles, Tag, Star, Truck, Shield, Heart } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product details
        const res = await fetch(`/api/products/${params.id}`)
        const data = await res.json()
        setProduct(data)

        // Fetch reviews for this product
        const reviewsRes = await fetch(`/api/reviews`)
        const reviewsData = await reviewsRes.json()
        if (Array.isArray(reviewsData)) {
          const productReviews = reviewsData.filter(r => r.product_id === params.id)
          setReviews(productReviews)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const addToCart = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      const cart = savedCart ? JSON.parse(savedCart) : []
      
      const existingItem = cart.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({ ...product, quantity })
      }
      
      localStorage.setItem('cart', JSON.stringify(cart))
      
      // Show success message
      alert(`Added ${quantity}x ${product.name} to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const buyNow = () => {
    addToCart()
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
          </Button>
        </div>
      </div>
    )
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Artisan Coffee Roasters
            </span>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.compare_at_price && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0">
                  SALE
                </Badge>
              )}
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Orders over $50</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Quality Guaranteed</p>
                <p className="text-xs text-muted-foreground">30-day return</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Fresh Roasted</p>
                <p className="text-xs text-muted-foreground">To order</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="outline" className="mb-3">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i <= avgRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {avgRating} ({reviews.length} reviews)
                  </span>
                </div>
              )}

              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold">${product.price}</span>
                {product.compare_at_price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.compare_at_price}
                    </span>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      Save ${(product.compare_at_price - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>
              {product.weight && (
                <p className="text-sm text-muted-foreground">Weight: {product.weight}</p>
              )}
            </div>

            {/* Stock */}
            {product.stock && (
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <span className="text-sm font-medium">
                    {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left!`}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-12"
                onClick={buyNow}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full rounded-xl h-12"
                onClick={addToCart}
              >
                Add to Cart
              </Button>
              {product.bargain_enabled && (
                <Button 
                  size="lg" 
                  variant="ghost"
                  className="w-full rounded-xl h-12"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Make an Offer (Min: ${product.bargain_min_price})
                </Button>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">{review.author_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <p className="font-medium text-sm mb-2">{review.title}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
