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

    if(res.ok){
        const data = await res.json()
        dispatch(recieveReview(data))
        return data
    }
    return res
}

export const deleteReview = (reviewId) =>async (dispatch)=>{
    const res = await csrfFetch(`api/reviews/${reviewId}`,{
        method:"DELETE"
    })

    if(res.ok){
        const data = await res.json()
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
            return {...state, [action.review.id]:action.review}
        case REMOVE_REVIEW:
            newState = {...state}
            delete newState[action.reviewId]
            return newState
        default:return state
    }
}
export default reviewReducer