import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { useEffect, useState, useRef } from 'react'
import { getReviewById } from '../../store/reviews';
import PostReview from '../PostReviewForm';
import OpenModalButton from '../OpenModalButton';
import DeleteReview from '../DeleteReview';
import './index.css'

const SpotDetails = () => {
    let imgs
    const [isLoaded, setIsLoaded] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgLoaded2, setImgLoaded2] = useState(false)
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

    useEffect(() => {
        if (isLoaded) {
            if(Object.values(spot)){
                imgs = spot.SpotImages
                // console.log(imgs)
            }
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
            
            if(spot.avgStarRating){
                setAvgStar(true)
            }
            if(Object.values(spot).length){
                // console.log(spot)
                setImgLoaded(true)
            }
        }
    }, [isLoaded, user, reviews, spot, avgStar])
    
    const closeMenu = () => setShowMenu(false);

    // console.log(spot.avgStarRating)

    useEffect(() => {
        dispatch(getSpotById(spotId)).then(() => {
            dispatch(getReviewById(spotId))
        }).then(() => {
            setIsLoaded(true)

        })
    }, [reviews.length, imgs, isLoaded])

    // console.log()
    // console.log()
    // console.log(spot.SpotImages)
    return (<section>
        {isLoaded && <>
            <h1>{spot.name}</h1>
            <h4>{spot.city}, {spot.state}, {spot.country}</h4>

            <div className='preview-img'>
            {imgLoaded && spot.SpotImages.length ? <img src={spot.SpotImages[0].url} />:<></>}
            </div>

            <div className='other-imgs'>
                {imgLoaded && spot.SpotImages.length ? spot.SpotImages.slice(1).map((img) => {
                    // console.log(img)
                    return <img key={img.url} src={img.url} />
                }):<></>}
            </div>

            <div className='reserve-description'>
                <div id='desc'>
                <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                <p id='spot-desc'>{spot.description}</p>
                </div>
                <div className='reserve-section'>
                    <div className='price'>
                    <label>${spot.price} night </label>
                    </div>
                    <div className='reveiw-on-reserve-button'>
                    {reviews.length === 1 ? <label><i className="fa fa-star" aria-hidden="true"></i>{reviews[0].stars.toFixed(1)} · {reviews.length} review</label> : <></>}
                    {reviews.length > 1 ? <label><i className="fa fa-star" aria-hidden="true"></i>{spot.avgStarRating.toFixed(1)} · {reviews.length} reviews</label> : <></>}
                    {!reviews.length ? <label><i className="fa fa-star" aria-hidden="true"></i>New!</label>: <></>}
                    </div>
                    <button id='reserve-button' onClick={()=>alert('Feature coming soon!')}>Reserve</button>
                </div>
            </div>

            <div className='divider'></div>
            <div className='reviews-botton'>
            {reviews.length === 1 ? <label><i className="fa fa-star" aria-hidden="true"></i>{reviews[0].stars.toFixed(1)} · {reviews.length} review</label>: <></>}
            {reviews.length > 1 ? <label><i className="fa fa-star" aria-hidden="true"></i>{spot.avgStarRating.toFixed(1)} · {reviews.length} reviews</label> :<></>}
            {!reviews.length ?  <label><i className="fa fa-star" aria-hidden="true"></i>New!</label>:<></>}
            </div>
            <div>

                {showMenu && <>
                    <>
                        <OpenModalButton
                            style={{
                                "color":'white',
                                "background-color":"gray"
                            }}
                            buttonText="Post a review"
                            onItemClick={closeMenu}
                            modalComponent={<PostReview spotId={spotId} />}
                        />
                    </>
                </>}

                {!reviews.length && showMenu ? <p>Be first to post a review!</p>:<></>}
                {reviews && reviews.map((review) => {
                    if (user) {
                        if(!(review.User.id === undefined)){
                           if (user.id === review.User.id) {
                            return <div key={review.id}>
                                <h4 className='firstName-onReview'>{review.User.firstName}</h4>
                                <p>{monthNames[Number(review.createdAt.toString().split('-')[1]) - 1]}-{review.createdAt.toString().split('-')[0]}</p>
                                <p>{review.review}</p>
                                <>
                                    <OpenModalButton
                                        style={{
                                            "color":'white',
                                            "background-color":"gray"
                                        }}
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
                        <h4 className='firstName-onReview'>{review.User.firstName}</h4>
                        <p className='date-onReview'>{monthNames[Number(review.createdAt.toString().split('-')[1]) - 1]}-{review.createdAt.toString().split('-')[0]}</p>
                        <p>{review.review}</p>
                    </div>
                })}
            </div>
        </>}
    </section>)
}
export default SpotDetails