import { Link, NavLink, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewById } from '../../store/reviews';
import DeleteSpot from '../DeleteSpot';
import OpenModalButton from '../OpenModalButton';
import './SpotBox.css'

const SpotBox = ({ spot, manage }) => {
    // console.log(spot)
    const [isLoaded, setIsLoaded] = useState(false)
    const [loadedPreviewImg, setLoadedPreviewImg] = useState(false)
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
            if(spot.previewImage){
                setLoadedPreviewImg(true)
            }    
        }).then(()=>{
        })
    }, [spot, isLoaded])

    return (<>
        {isLoaded && <><div className='spot-container'>
            <div onClick={handleSpotClick}>
                {loadedPreviewImg && <div className='img-container'><img src={spot.previewImage} /></div>}
                <div className='location-review'>
                <label>{spot.city}, {spot.state}</label>
                {spot.avgStarRating? <label><i className="fa fa-star" aria-hidden="true"></i>{spot.avgStarRating.toFixed(1)}</label> : <label><i className="fa fa-star" aria-hidden="true"></i>New!</label>}
                </div>
                
                <label>${spot.price} night</label>
           </div>

            </div>

        
        </>}
    </>
    )
}

export default SpotBox