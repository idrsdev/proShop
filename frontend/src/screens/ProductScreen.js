import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
   Row,
   Col,
   Image,
   ListGroup,
   Card,
   Button,
   ListGroupItem,
   Form,
} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import {
   listProductDetails,
   createProductReview,
} from '../actions/productActions'

const ProductScreen = ({ match, history }) => {
   const [qty, setQty] = useState(1)
   const [rating, setRating] = useState(0)
   const [comment, setComment] = useState('')
   const [reviewSubmited, setReviewSubmited] = useState('')

   const dispatch = useDispatch()

   const productDetails = useSelector((state) => state.productDetails)
   const { loading, error, product } = productDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const productReviewCreate = useSelector((state) => state.productReviewCreate)
   const {
      success: successProductReview,
      error: errorProductReview,
   } = productReviewCreate

   useEffect(() => {
      if (successProductReview) {
         //alert('Review Submitted!')
         //window.setTimeout('alert("Review Submitted!");window.close();', 3000)
         setReviewSubmited(true)
         window.setTimeout(() => setReviewSubmited(false), 7000)
         setRating(0)
         setComment('')
         dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
      }
      dispatch(listProductDetails(match.params.id))
   }, [dispatch, match, successProductReview, reviewSubmited])

   const addToCartHandler = () => {
      history.push(`/cart/${match.params.id}?qty=${qty}`)
   }

   const submitHandler = (e) => {
      e.preventDefault()
      dispatch(
         createProductReview(match.params.id, {
            rating,
            comment,
         })
      )
   }

   return (
      <>
         <Link className='btn btn-light my-2' to='/'>
            Go Back
         </Link>
         {loading ? (
            <Loader />
         ) : error ? (
            <Message variant='danger'>{error}</Message>
         ) : (
            <>
               <Row>
                  <Col md={6}>
                     <Image src={product.image} alt={product.name} fluid />
                  </Col>
                  <Col md={3}>
                     <ListGroup variant='flush'>
                        <ListGroupItem>
                           <div className='smal'>
                              <h3>{product.name}</h3>
                           </div>
                        </ListGroupItem>
                        <ListGroupItem>
                           <Rating
                              value={product.rating}
                              text={`${product.numReviews} reviews`}
                           />
                        </ListGroupItem>
                        <ListGroupItem>Price: ${product.price}</ListGroupItem>
                        <ListGroupItem>
                           Description: {product.description}
                        </ListGroupItem>
                     </ListGroup>
                  </Col>
                  <Col md={3}>
                     <Card>
                        <ListGroup variant='flush'>
                           <ListGroupItem>
                              <Row>
                                 <Col>Price:</Col>
                                 <Col>
                                    <strong>${product.price}</strong>
                                 </Col>
                              </Row>
                           </ListGroupItem>
                           <ListGroupItem>
                              <Row>
                                 <Col>Status:</Col>
                                 <Col>
                                    {product.countInStock > 0
                                       ? 'In Stock'
                                       : 'Out of Stock'}
                                 </Col>
                              </Row>
                           </ListGroupItem>
                           {product.countInStock > 0 && (
                              <ListGroupItem>
                                 <Row>
                                    <Col>Qty</Col>
                                    <Col>
                                       <Form.Control
                                          as='select'
                                          value={qty}
                                          onChange={(e) => {
                                             setQty(e.target.value)
                                          }}
                                       >
                                          {[
                                             ...Array(
                                                product.countInStock
                                             ).keys(),
                                          ].map((x) => (
                                             <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                             </option>
                                          ))}
                                       </Form.Control>
                                    </Col>
                                 </Row>
                              </ListGroupItem>
                           )}
                           <ListGroupItem>
                              <Button
                                 onClick={addToCartHandler}
                                 className='btn-block'
                                 type='button'
                                 disabled={product.countInStock === 0}
                              >
                                 Add To Cart
                              </Button>
                           </ListGroupItem>
                        </ListGroup>
                     </Card>
                  </Col>
               </Row>
               <Row>
                  <Col md={6}>
                     <h3 className='mt-3 bold'>Reviews</h3>
                     {product.reviews.length === 0 && (
                        <Message>No Reviews</Message>
                     )}
                     {reviewSubmited ? (
                        <Message>Review Submited</Message>
                     ) : (
                        <></>
                     )}
                     <ListGroup variant='flush'>
                        {product.reviews.map((review) => (
                           <ListGroup.Item key={review._id}>
                              <strong>{review.name}</strong>
                              <Rating value={review.rating} />
                              <p>{review.createdAt.substring(0, 10)}</p>
                              <p>{review.comment}</p>
                           </ListGroup.Item>
                        ))}
                        <ListGroup.Item>
                           <h3 className='bold'>Write a Customer Review</h3>
                           {errorProductReview && (
                              <Message variant='danger'>
                                 {errorProductReview}
                              </Message>
                           )}
                           {userInfo ? (
                              <Form onSubmit={submitHandler}>
                                 <Form.Group controlId='rating'>
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                       as='select'
                                       value={rating}
                                       onChange={(e) =>
                                          setRating(e.target.value)
                                       }
                                    >
                                       <option value=''>Select...</option>
                                       <option value='1'>1 - Poor</option>
                                       <option value='2'>2 - Fair</option>
                                       <option value='3'>3 - Good</option>
                                       <option value='4'>4 - Very Good</option>
                                       <option value='5'>5 - Excellent</option>
                                    </Form.Control>
                                 </Form.Group>
                                 <Form.Group controlId='comment'>
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                       as='textarea'
                                       row='3'
                                       value={comment}
                                       onChange={(e) =>
                                          setComment(e.target.value)
                                       }
                                    ></Form.Control>
                                 </Form.Group>
                                 <Button type='submit' variant='primary'>
                                    Submit
                                 </Button>
                              </Form>
                           ) : (
                              <Message>
                                 Please <Link to='/login'>sign in</Link> to
                                 write a review{' '}
                              </Message>
                           )}
                        </ListGroup.Item>
                     </ListGroup>
                  </Col>
               </Row>
            </>
         )}
      </>
   )
}

export default ProductScreen
