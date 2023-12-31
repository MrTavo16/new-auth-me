import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { getSpotsOfCurrUser } from '../../store/spots';
import SpotBox from '../SpotBox';
import { useHistory } from "react-router-dom"
import DeleteSpot from '../DeleteSpot';
import OpenModalButton from '../OpenModalButton';
import './ManageSpots.css'

const ManageSpots = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const history = useHistory()
    const currUser = useSelector(state => state.session)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSpotsOfCurrUser()).then(() => {
            setIsLoaded(true)
        })
    }, [])

    const spots = useSelector(state => state.spots)

    return (
        <div id='outer'>
                <h1>Manage Your Spots</h1>
                {isLoaded && !Object.values(spots).length ? <button id='create-b' onClick={()=>history.push('/spots/new')}>Create a New Spot</button>:<></>}
            {isLoaded && <div id='upper-div'>
                {Object.values(spots).map((spot) => {
                    return (
                        <div key={spot.id}>
                        <div className='man-spots'>
                            <SpotBox spot={spot} />
                            <div id='del-up'>
                                <button className='up-button' onClick={()=>history.push(`/spots/${spot.id}/edit`)}>Update</button>
                                <>
                                    <OpenModalButton
                                        style={{
                                            "color":"white",
                                            "backgroundColor":"gray"
                                        }}
                                        buttonText="Delete"
                                        modalComponent={<DeleteSpot spotId={spot.id} />}
                                        />
                                </>
                        </div>
                        </div>
                         </div>
                    )
                })}
            </div>}
        </div>
    )
}

export default ManageSpots