const LOAD_REVIEWS_BY_SPOT_ID = 'reviews/LOAD_REVIEWS_BY_SPOT_ID'

//------------------------------
export const loadReviewsBySpotId = (reviews)=>({
    type:LOAD_REVIEWS_BY_SPOT_ID,
    reviews
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


//------------------------------
const reviewReducer = (state = {}, action)=>{
    switch(action.type){
        case LOAD_REVIEWS_BY_SPOT_ID:
            const newState = {...state}
            action.reviews.reviews.forEach((review)=>{
                newState[review.id] = review
            })
            return newState
        default:return state
    }
}
export default reviewReducer