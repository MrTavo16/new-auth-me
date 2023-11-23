import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { useEffect, useState, useRef } from 'react'
import { getReviewById } from '../../store/reviews';
import PostReview from '../PostReviewForm';
import OpenModalButton from '../OpenModalButton';
import DeleteReview from '../DeleteReview';

const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [avgStar, setAvgStar] = useState(false)
    const dispatch = useDispatch()
    const spotId = Number(useParams().spotId)
    const spot = useSelector(state => state.spots[`${spotId}`])
    const stateReviews = useSelector(state => state.reviews)
    const reviews = Object.values(stateReviews).reverse().filter((review) => Number(review.spotId) == Number(spotId))
    const user = useSelector(state => state.session.user)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    // console.log(reviews)

    useEffect(() => {
        if (isLoaded) {
            if (user) {
                if(!(user.id === spot.Owner.id)&&!reviews.length){
                    setShowMenu(true)
                }
                for(let i = 0;i <reviews.length ;i++){
                    const review = reviews[i]
                    if (!(user.id === spot.Owner.id) && !(user.id === review.User.id)) {
                        return setShowMenu(true)
                    }else{
                        return setShowMenu(false)
                    }
                }
            }else{
                setShowMenu(false)
            }
            
            if(!(spot.avgStarRating === undefined)){
                setAvgStar(true)
            }else{
                setAvgStar(false)
            }
        }
    }, [isLoaded, user, reviews, spot, avgStar])
    
    const closeMenu = () => setShowMenu(false);

    // console.log(showMenu)
    useEffect(() => {
        dispatch(getSpotById(spotId)).then(() => {
            dispatch(getReviewById(spotId))
        }).then(() => {
            setIsLoaded(true)
        })
    }, [dispatch])
    // console.log(spot.SpotImages)
    return (<section>
        {isLoaded && <>

            <h1>{spot.name}</h1>
            <h3>{spot.city}, {spot.state}, {spot.country}</h3>

            <div>
                <img src={spot.SpotImages[0].url} />
            </div>
            <div>
                {spot.SpotImages.slice(1).map((img) => {
                    console.log(img)
                    return <img key={img.url} src={img.url} />
                })}
            </div>
            <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
            <p>{spot.description}</p>
            <div>
                <div>
                    <label>${spot.price} night </label>
                    {reviews.length === 1 ? <label>{spot.avgStarRating.toFixed(1)} · {reviews.length} review</label> : <></>}
                    {reviews.length > 1 ? <label>{spot.avgStarRating.toFixed(1)} · {reviews.length} reviews</label> : <></>}
                    {!reviews.length ? <label><i className="fa fa-star" aria-hidden="true"></i>New!</label>: <></>}
                </div>
                <button>Reserve</button>
            </div>

            <div>----------------------------------</div>

            {avgStar&&reviews.length === 1 ? <label>{spot.avgStarRating.toFixed(1)} · {reviews.length} review</label> : <></>}
            {avgStar&&reviews.length > 1 ? <label>{spot.avgStarRating.toFixed(1)} · {reviews.length} reviews</label> :<></>}
            {!reviews.length ?  <label><i className="fa fa-star" aria-hidden="true"></i>New!</label>:<></>}
            <div>

                {showMenu && <>
                    <>
                        <OpenModalButton
                            buttonText="Post a review"
                            onItemClick={closeMenu}
                            modalComponent={<PostReview spotId={spotId} />}
                        />
                    </>
                </>}

                {!reviews.length && <p>Be first to post a review!</p>}
                {reviews && reviews.map((review) => {
                    if (user) {
                        if(!(review.User.id === undefined)){
                           if (user.id === review.User.id) {
                            return <div key={review.id}>
                                <h4>{review.User.firstName}</h4>
                                <p>{monthNames[Number(review.createdAt.toString().split('-')[1]) - 1]}-{review.createdAt.toString().split('-')[0]}</p>
                                <p>{review.review}</p>
                                <>
                                    <OpenModalButton
                                        buttonText="Delete"
                                        onItemClick={closeMenu}
                                        modalComponent={<DeleteReview spotId={spot.id} reviewId={review.id} />}
                                    />
                                </>
                            </div>
                            } 
                        }
                        
                    }

                    return <div key={review.id}>
                        <h4>{review.User.firstName}</h4>
                        <p>{monthNames[Number(review.createdAt.toString().split('-')[1]) - 1]}-{review.createdAt.toString().split('-')[0]}</p>
                        <p>{review.review}</p>
                    </div>
                })}
            </div>
        </>}
    </section>)
}
export default SpotDetails