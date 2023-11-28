import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const RECIEVE_SPOT = 'spots/RECIEVE_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const REMOVE_SPOT = 'spots/REMOVE_SPOT'
const ADD_IMAGE = 'spots/ADD_IMAGE'
//---------------------------
export const loadSpots = (spots)=>({
    type:LOAD_SPOTS,
    spots
})

export const recieveSpot = (spot)=>({
    type:RECIEVE_SPOT,
    spot
})

export const editSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
});

export const removeSpot = (spotId)=>({
    type:REMOVE_SPOT,
    spotId
})

export const recieveImage = (img)=>({
    type: ADD_IMAGE,
    img
})
//---------------------------
export const addImage = (img)=>async (dispatch)=>{
    const res = await csrfFetch(`/api/spots/${img.spotId}/images`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(img)
    })
    if(res.ok){
        const data = await res.json()
        return data
    }
    return res
}

export const getAllSpots = ()=>async (dispatch)=>{
    const res = await fetch('/api/spots')
    if(res.ok){
        const data = await res.json()
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

export const getSpotsOfCurrUser = (userId)=> async (dispatch)=>{
    const res = await fetch('/api/spots/current') 

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

export const updateSpot = (spot) =>async (dispatch)=>{
    const res = await csrfFetch(`/api/spots/${spot.id}`,{
        method:'PUT',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    })
    
    if(res.ok){
        const data = await res.json()
        dispatch(editSpot(data))
      }
      return res
}

export const deleteSpot = (spotId)=>async (dispatch)=>{
    const res = await csrfFetch(`/api/spots/${spotId}`,{
        method:"DELETE"
    })

    if(res.ok){
        const data = await res.json()
        dispatch(removeSpot(spotId))
        return data
      }
      return res
}

const spotReducer = (state = {}, action)=>{
    let newState = null
    switch(action.type){
        case LOAD_SPOTS:
            newState = {}
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
        case UPDATE_SPOT:
            return {...state, [action.spot.id]:action.spot}
        case REMOVE_SPOT:
            newState = {...state}
            delete newState[action.spotId]
            return newState
        default: return state
    }
}
export default spotReducer