import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import SpotBox from '../SpotBox';

const HomePage = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()
    
    useEffect( () => {
        dispatch(getAllSpots()).then(()=>{
            setIsLoaded(true)
        })
    }, [])
    const spots = useSelector(state => state.spots)
    
    return (
        <section>
            {isLoaded&&<div>
                {Object.values(spots).map((spot) => {
                    return<SpotBox key={spot.id} spot={spot}/>  
                })}
            </div>}
        </section>
    )
}

export default HomePage