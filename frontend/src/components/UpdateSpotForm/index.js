import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useHistory} from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { getSpotById } from "../../store/spots";
import { updateSpot } from "../../store/spots";
import './updateSpot.css'

function UpdateSpotForm(){
    const history = useHistory()
    const [isLoaded, setIsLoaded] = useState(false)
    const [submited, setSubmited] = useState(false)
    const dispatch = useDispatch();
    const {spotId} = useParams()
    const spots = Object.values(useSelector(state=>state.spots))
    const currSpot = spots.filter(spot=>spot.id == Number(spotId))
    const [errors, setErrors] = useState({})
    const [imgErrors, setImgErrors] = useState({})
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [description, setDescription] = useState('')
    const [spotName, setSpotName] = useState('')
    const [price, setPrice] = useState('')
    const [previewImg, setPreviewImage] = useState('')
    const [img, setImg] = useState(``)
    const [img1, setImg1] = useState(``)
    const [img2, setImg2] = useState(``)
    const [img3, setImg3] = useState(``)
    
    useEffect(()=>{
        dispatch(getSpotById(spotId)).then(() => {
        const currSpot = spots.filter(spot=>spot.id == Number(spotId))
        setIsLoaded(true)
        })
        
        const currErrors = {}
        if (submited) {
            if (!address.length) {
                currErrors.address = 'Address is required'
            }
            if (!city.length) {
                currErrors.city = 'City is required'
            }
            if (!state.length) {
                currErrors.state = 'State is required'
            }
            if (!country.length) {
                currErrors.country = 'Country is required'
            }
            if (!longitude.length || isNaN(Number(longitude)) || !(longitude >= -180 && longitude <= 180)) {
                currErrors.longitude = 'Longitute needs to be between -180 and 180'
            }
            if (!price.length || isNaN(Number(longitude))) {
                currErrors.price = 'Price'
            }
            if (!latitude.length || isNaN(Number(latitude)) || !(latitude >= -90 && latitude <= 90)) {
                currErrors.latitude = 'latitude needs to be between -90 and 90'
                console.log(currErrors.latitude)
            }
            
            if (description < 30) currErrors.description = "Description need 30 or more characters"
            if (!spotName.length) currErrors.spotName = "Spot Name is required"
            setErrors(currErrors)
        }
        
        setImgErrors(currErrors)
    },[submited, description, spotName, longitude, latitude, address, city, state, country, price])

    useEffect(()=>{
        if(isLoaded){
            // const currPreviewImg = currSpot[0].SpotImages.filter()
            setAddress(`${currSpot[0].address}`)
            setCountry(`${currSpot[0].country}`)
            setCity(`${currSpot[0].city}`)
            setState(`${currSpot[0].state}`)
            setLongitude(`${currSpot[0].lng}`)
            setLatitude(`${currSpot[0].lat}`)
            setSpotName(`${currSpot[0].name}`)
            setDescription(`${currSpot[0].description}`)
            setPrice(`${currSpot[0].price}`)
            // setPreviewImage(`${currSpot[0].previewImage}`)  
        }
        // console.log(currSpot[0].SpotImages)
    },[isLoaded])

    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(updateSpot({
            "id": currSpot[0].id,
            "address": address,
            "city": city,
            "state": state,
            "country": country,
            "lat": Number(latitude),
            "lng": Number(longitude),
            "name": spotName,
            "description": description,
            "price": Number(price)
        })).catch(async (res)=>{
            const data = await res.json()
            if(data && data.errors){
                setErrors(data.errors)
                setSubmited(true)
            }
        }).then((spot)=>{
            console.log(spot,'--------------')
            if(spot){
                history.push(`/spots/${currSpot[0].id}`)
            }
        })
    }

    return(
        <div id='saver'>
        {isLoaded&&
        <div className="form-div">
            <h1>Update your Spot</h1>
            <h2>Where's your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation</p>
                <form id='whole-form' onSubmit={handleSubmit}>
                    <div id="country">
                        <div>
                            Country
                        </div>
                            <input
                                type='text'
                                placeholder='Country'
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        {/* {errors.country && <p>{errors.country}</p>} */}
                        {imgErrors.country && <p className="errors" >{imgErrors.country}</p>}
                    </div>
                    <label>
                        Street Address
                        <input
                            id="address-input"
                            placeholder='Address'
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    {/* {errors.address && <p>{errors.address}</p>} */}
                    {imgErrors.address && <p className="errors" >{imgErrors.address}</p>}
                    <div>
                        <label>
                            City
                            <input
                                id="city-input"
                                type="text"
                                placeholder='City'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                />
                        </label>
                        {/* {errors.city && <p>{errors.city}</p>} */}
                        {imgErrors.city && <p className="errors" >{imgErrors.city}</p>}
                        ,{'  '}
                        <label>
                            State
                            <input
                                type="text"
                                id="state-input"
                                placeholder='State'
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </label>
                        {/* {errors.state && <p>{errors.state}</p>} */}
                        {imgErrors.state && <p className="errors" >{imgErrors.state}</p>}
                    </div>
                    <div>
                        <label>
                            Latitude
                            <input
                                type="text"
                                placeholder='Latitude'
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            />
                        </label>
                        {errors.lat && <p className="errors" >{errors.lat}</p>}
                        {imgErrors.latitude && <p>{imgErrors.latitude}</p>}
                        ,
                        <label>
                            Longitude
                            <input
                                type="text"
                                placeholder='Longitude'
                                id="long-input"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            />
                        </label>
                        {imgErrors.longitude && <p className="errors" >{imgErrors.longitude}</p>}
                        {/* {errors.lng && <p>{errors.lng}</p>} */}
                    </div>
                    <div className="dividers"></div>
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amentities like fast wif or parking, and what you love about the neighborhood.</p>

                    <textarea
                        value={description}
                        placeholder="Please write at least 30 characters"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {imgErrors.description && <p className="errors">{imgErrors.description}</p>}
                    <div className="dividers"></div>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <label>
                        
                        <input
                            type="text"
                            id="name-input"
                            placeholder='Name of your spot'
                            value={spotName}
                            onChange={(e) => setSpotName(e.target.value)}
                        />
                    </label>
                    {imgErrors.spotName && <p className="errors" >{imgErrors.spotName}</p>}
                    <div className="dividers"></div>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <div>
                        $
                        <label>
                            
                            <input
                                type="text"
                                id="price-input"
                                placeholder="Price per night '(USD)'"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                    </div>
                    {errors.price && <p className="errors" >{errors.price}</p>}
                    <div className="dividers"></div>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to a least one photo to publish your spot</p>
                    <label>
                        <input
                            type="text"
                            placeholder="Preview Image  url"
                            className="imgs"
                            value={previewImg}
                            onChange={(e) => setPreviewImage(e.target.value)}
                        />
                    </label>
                    {imgErrors.img && <p className="errors" >{imgErrors.img}</p>}
                    <label>
                        <input
                            type="text"
                            placeholder="Image  url"
                            className="imgs"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                        />
                    </label>
                    {imgErrors.imgEnds && <p className="errors" >{imgErrors.imgEnds}</p>}
                    <label>
                        <input
                            type="text"
                            placeholder="Image  url"
                            className="imgs"
                            value={img1}
                            onChange={(e) => setImg1(e.target.value)}
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            placeholder="Image  url"
                            className="imgs"
                            value={img2}
                            onChange={(e) => setImg2(e.target.value)}
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            placeholder="Image  url"
                            className="imgs"
                            value={img3}
                            onChange={(e) => setImg3(e.target.value)}
                        />
                    </label>
                    <div className="dividers"></div>
                    {errors.message && <p>{errors.message}</p>}
                    <button
                        id="create-button"
                        type="submit"
                        disabled={Object.values(errors).length || Object.values(imgErrors).length}
                    >
                        Create Spot
                    </button>
                </form>
            </div>}
        </div>
    )
}
export default UpdateSpotForm