import { csrfFetch } from "./csrf"

const LOAD_REVIEWS_BY_SPOT_ID = 'reviews/LOAD_REVIEWS_BY_SPOT_ID'
const RECIEVE_REVIEW = 'reviews/RECIEVE_REVIEW'
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW'
//------------------------------
export const loadReviewsBySpotId = (reviews)=>({
    type:LOAD_REVIEWS_BY_SPOT_ID,
    reviews
})

export const recieveReview = (review)=>({
    type:RECIEVE_REVIEW,
    review
}) 

export const removeReview = (reviewId)=>({
    type:REMOVE_REVIEW,
    reviewId
})
//------------------------------
export const getReviewById = (spotId)=>async (dispatch)=>{
    const res = await fetch(`/api/spots/${spotId}/reviews`)

    if(res.ok){
        const data = await res.json()
        // console.log(data,'--------------')
        dispatch(loadReviewsBySpotId(data))
        return data
    }
    return res
}

export const createReview = (review) =>async (dispatch)=>{
    const res = await csrfFetch(`/api/spots/${review.spotId}/reviews`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(review)
    })
    console.log(res, 'res')
    if(res.ok){
        const data = await res.json()
        // console.log(data)
        dispatch(recieveReview(data))
        return data
    }
    return res
}

export const deleteReview = (reviewId) =>async (dispatch)=>{
    const res = await csrfFetch(`/api/reviews/${reviewId}`,{
        method:"DELETE",
        headers:{'Content-Type':'application/json'}
    })
    
    if(res.ok){
        
        const data = await res.json()
        // console.log(data)
        dispatch(removeReview(reviewId))
        return data
      }
      return res
}
//------------------------------
const reviewReducer = (state = {}, action)=>{
    switch(action.type){
        case LOAD_REVIEWS_BY_SPOT_ID:
            const newState = {...state}
            action.reviews.reviews.forEach((review)=>{
                newState[review.id] = review
            })
            return newState
        case RECIEVE_REVIEW:
            // console.log(action.review)
            return {...state, [action.review.id]:action.review}
        case REMOVE_REVIEW:
            const newState1 = {...state}
            delete newState1[action.reviewId]
            return newState1
        default:return state
    }
}
export default reviewReducer