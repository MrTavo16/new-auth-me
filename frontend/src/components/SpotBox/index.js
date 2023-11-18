import { Link, NavLink, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const SpotBox = ({spot}) => {
    let review
    // console.log(spot.previewImage)
    const history = useHistory()
    const handleSpotClick = () => {
        history.push(`/spots/${spot.id}`)
    };

    return (<div onClick={handleSpotClick}>
        {/* {spot.previewImage && <img src={spot.previewImage} />} */}
        <label>{spot.city}, {spot.state}</label>
        <div>
            <img />
            {review ? <button>{spot.avgStarRating}</button> : 'New!'}
        </div>
        <label>{spot.price} night</label>
    </div>
    )
}

export default SpotBox