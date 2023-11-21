import { Link, NavLink, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewById } from '../../store/reviews';


const SpotBox = ({ spot }) => {
    // console.log(spot)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isNew, setIsNew] = useState(true)
    const dispatch = useDispatch()
    const history = useHistory()
    const review = Object.values(useSelector(state => state.reviews))


    const handleSpotClick = () => {
        history.push(`/spots/${spot.id}`)
    };

    useEffect(() => {
        dispatch(getReviewById(spot.id)).then(() => {
            setIsLoaded(true)    
        }).then(()=>{
        })
    }, [spot, isLoaded])

    return (<>
        {isLoaded && <>
            <div onClick={handleSpotClick}>
                {/* {spot.previewImage && <img src={spot.previewImage} />} */}
                <label>{spot.city}, {spot.state}</label>
                <div>
                    <img />
                    {spot.avgStarRating? <p>{spot.avgStarRating.toFixed(1)}</p> : 'New!'}
                </div>
                <label>{spot.price} night</label>
            </div>
        </>}
    </>
    )
}

export default SpotBox