import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { useEffect, useState } from 'react'
import { getReviewById } from '../../store/reviews';



const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()
    const spotId = Number(useParams().spotId)
    const spot = useSelector(state => state.spots[`${spotId}`])
    const stateReviews = useSelector(state=>state.reviews)
    const reviews = Object.values(stateReviews).filter((review)=> Number(review.spotId) == Number(spotId))
    const user = useSelector(state=>state.session.user)
    // console.log(user)

    const handleFirstPic = ()=>{
        if(spot.SpotImages.length){
            return spot.SpotImages[0].url
        }
    }
    
    useEffect( () => {
        dispatch(getSpotById(spotId)).then(() => {
            dispatch(getReviewById(spotId))
        }).then(()=>{
            setIsLoaded(true)
        })
    }, [dispatch])

    
    return (<section>
        {isLoaded &&<>

            <h1>{spot.name}</h1>
            <h3>{spot.city}, {spot.state}, {spot.country}</h3>

            <div>         
            {/* <img src={handleFirstPic} /> */}
            </div>
            <div>
                {spot.SpotImages.slice(1).map((img) => {
                    return <img key={img.url} src={img.url} />
                })}
            </div>
            <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
            <p>{spot.description}</p>
            <div>
                <div>
                    <label>${spot.price} night </label>
                    <label>{spot.avgStarRating} | {spot.numReviews} reviews</label>
                </div>
                <button>Reserve</button>
            </div>
            <div>----------------------------------</div>
            {reviews ? <label>{spot.avgStarRating} | {spot.numReviews} reviews</label> : <label>New!</label>}
            <div>
            {user && <button>Post Your Review</button>}
            {!reviews && <label>Be first to post a review</label>}
            {reviews &&reviews.map((review)=>{
                return <div key={review.id}>
                    <h4>{review.User.firstName}</h4>
                    <p>{review.createdAt.toString().split('-')[1]}-{review.createdAt.toString().split('-')[0]}</p>
                    <p>{review.review}</p>
                </div>
            })}
            </div>
            </>}
    </section>)
}

export default SpotDetails