import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { getSpotsOfCurrUser } from '../../store/spots';
import SpotBox from '../SpotBox';
import { useHistory } from "react-router-dom"
import DeleteSpot from '../DeleteSpot';
import OpenModalButton from '../OpenModalButton';


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
        <section>
            {isLoaded && <div>
                {Object.values(spots).map((spot) => {
                    return (
                        <div key={spot.id}>
                            <SpotBox spot={spot} />
                            <div>
                                <button onClick={()=>history.push(`/spots/${spot.id}/edit`)}>Update</button>
                                <>
                                    <OpenModalButton
                                        buttonText="Delete"
                                        modalComponent={<DeleteSpot spotId={spot.id} />}
                                    />
                                </>
                            </div>
                        </div>
                    )
                })}
            </div>}
        </section>
    )
}

export default ManageSpots