import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const RECIEVE_SPOT = 'spots/RECIEVE_SPOT'
//---------------------------
export const loadSpots = (spots)=>({
    type:LOAD_SPOTS,
    spots
})

export const recieveSpot = (spot)=>({
    type:RECIEVE_SPOT,
    spot
})
//---------------------------
export const getAllSpots = ()=>async (dispatch)=>{
    const res = await fetch('/api/spots')
    if(res.ok){
        const data = await res.json()
        console.log(data)
        dispatch(loadSpots(data))
        return data
    }
    return res
}

export const getSpotById = (spotId)=>async (dispatch)=>{
    const res = await fetch(`/api/spots/${spotId}`)
    
    if(res.ok){
        const data = await res.json()
        dispatch(loadSpots(data))
        return data
    }
    return res
}

export const createSpot=(payload)=>async(dispatch)=>{
    const res = await csrfFetch('/api/spots',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
    })

    if(res.ok){
        const data = await res.json()
        dispatch(recieveSpot(data))
        return data
    }
    return res
}

const spotReducer = (state = {}, action)=>{
    let newState = null
    switch(action.type){
        case LOAD_SPOTS:
            newState = {...state}
            // console.log(action.spots,'--------------')
            if(action.spots.Spots&& action.spots.Spots !== undefined){
               action.spots.Spots.forEach((spot)=>{
                newState[spot.id] = spot
                }) 
            }else{
                newState[action.spots.id] = action.spots
            }
            
            return newState
        case RECIEVE_SPOT:
            return {...state, [action.spot.id]:action.spot}

        default: return state
    }
}
export default spotReducer