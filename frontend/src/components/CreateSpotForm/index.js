import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createSpot } from "../../store/spots";
import { useHistory } from 'react-router-dom';
import { addImage } from "../../store/spots";

function CreateSpotForm() {
    const history = useHistory()
    const dispatch = useDispatch();
    const [submited, setSubmited] = useState(false)
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
    const [img, setImg] = useState('')
    const [img1, setImg1] = useState('')
    const [img2, setImg2] = useState('')
    const [img3, setImg3] = useState('')

    useEffect(() => {
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
            if (!previewImg.length) {
                currErrors.img = 'Preview image is required'
            }
            if (!(previewImg.endsWith('.png') || previewImg.endsWith('.jpg') || previewImg.endsWith('.jpeg'))) {
                currErrors.imgEnds = "Image URL must end in .png, .jpg, or .jpeg"
            }
            if(img.length){
                if(!(img.endsWith('.png') || img.endsWith('.jpg') || img.endsWith('.jpeg'))){
                    currErrors.img = "Image URL must end in .png, .jpg, or .jpeg"
                }
            }
            if(img1.length){
                if(!(img1.endsWith('.png') || img1.endsWith('.jpg') || img1.endsWith('.jpeg'))){
                    currErrors.img1 = "Image URL must end in .png, .jpg, or .jpeg"
                }
            }
            if(img2.length){
                if(!(img2.endsWith('.png') || img2.endsWith('.jpg') || img2.endsWith('.jpeg'))){
                    currErrors.img2 = "Image URL must end in .png, .jpg, or .jpeg"
                }
            }
            if(img3.length){
                if(!(img3.endsWith('.png') || img3.endsWith('.jpg') || img3.endsWith('.jpeg'))){
                    currErrors.img3 = "Image URL must end in .png, .jpg, or .jpeg"
                }
            }
            if (description < 30) currErrors.description = "Description need 30 or more characters"
            if (!spotName.length) currErrors.spotName = "Spot Name is required"
        }
        setErrors(currErrors)
        setImgErrors(currErrors)
    }, [submited, previewImg,img, img1, img2, img3, description, spotName, longitude, latitude, address, city, state, country, price])

    // console.log(latitude, '-------')
    // console.log(errors, '-------')

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createSpot({
            "address": address,
            "city": city,
            "state": state,
            "country": country,
            "lat": Number(latitude),
            "lng": Number(longitude),
            "name": spotName,
            "description": description,
            "price": Number(price)
        })).catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) {
                setErrors(data.errors)
                setSubmited(true)
            }
        }).then((spot) => {
            if (spot.id) {
                const spotId = spot.id
                console.log(spot.id, 'from create------')
                dispatch(addImage({
                    "spotId":spotId,
                    "url":previewImg,
                    "preview": true
                }))
                if(img){
                    dispatch(addImage({
                        "spotId":spotId,
                        "url":img,
                        "preview": false
                    }))
                }
                if(img1){
                    dispatch(addImage({
                        "spotId":spotId,
                        "url":img1,
                        "preview": false
                    }))
                }
                if(img2){
                    dispatch(addImage({
                        "spotId":spotId,
                        "url":img2,
                        "preview": false
                    }))
                }
                if(img3){
                    dispatch(addImage({
                        "spotId":spotId,
                        "url":img3,
                        "preview": false
                    }))
                }
                history.push(`/spots/${spot.id}`)
        }

        })
    }

    return (
        <>
            <h1>Create a new Spot</h1>
            <h2>Where's your place located?</h2>
            <p>Guests will only get your exact address once they booked a reservation</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Country
                    <input
                        type='text'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </label>
                {errors.country && <p>{errors.country}</p>}
                {imgErrors.country && <p>{imgErrors.country}</p>}
                <label>
                    Address
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                {errors.address && <p>{errors.address}</p>}
                {imgErrors.address && <p>{imgErrors.address}</p>}
                <div>
                    <label>
                        City
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </label>
                    {errors.city && <p>{errors.city}</p>}
                    {imgErrors.city && <p>{imgErrors.city}</p>}
                    ,
                    <label>
                        State
                        <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </label>
                    {errors.state && <p>{errors.state}</p>}
                    {imgErrors.state && <p>{imgErrors.state}</p>}
                </div>
                <div>
                    <label>
                        Latitude
                        <input
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                        />
                    </label>
                    {errors.lat && <p>{errors.lat}</p>}
                    {imgErrors.latitude && <p>{imgErrors.latitude}</p>}
                    ,
                    <label>
                        Longitude
                        <input
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                        />
                    </label>
                    {imgErrors.longitude && <p>{imgErrors.longitude}</p>}
                    {errors.lng && <p>{errors.lng}</p>}
                </div>
                <div>-----------------------------</div>
                <h1>Describe your place to guests</h1>
                <p>Mention the best features of your space, any special amentities like fast wif or parking, and what you love about the neighborhood.</p>
                <label>
                    Description
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                {imgErrors.description && <p>{imgErrors.description}</p>}
                <div>------------------------------</div>
                <h1>Create a title for your spot</h1>
                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                <label>
                    Name of your spot
                    <input
                        type="text"
                        value={spotName}
                        onChange={(e) => setSpotName(e.target.value)}
                    />
                </label>
                {imgErrors.spotName && <p>{imgErrors.spotName}</p>}
                <div>--------------------------------</div>
                <h1>Set a base price for your spot</h1>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <div>
                    $
                    <label>
                        Price per night {'(USD)'}
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </label>
                </div>
                {errors.price && <p>{errors.price}</p>}
                <div>--------------------------------</div>
                <h1>Liven up your spot with photos</h1>
                <p>Submit a link to a least one photo to publish your spot</p>
                <label>
                    Preview Image  url
                    <input
                        type="text"
                        value={previewImg}
                        onChange={(e) => setPreviewImage(e.target.value)}
                    />
                </label>
                {imgErrors.img && <p>{imgErrors.img}</p>}
                <label>
                    Image  url
                    <input
                        type="text"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                    />
                </label>
                {imgErrors.imgEnds && <p>{imgErrors.imgEnds}</p>}
                <label>
                    Image  url
                    <input
                        type="text"
                        value={img1}
                        onChange={(e) => setImg1(e.target.value)}
                    />
                </label>
                <label>
                    Image  url
                    <input
                        type="text"
                        value={img2}
                        onChange={(e) => setImg2(e.target.value)}
                    />
                </label>
                <label>
                    Image  url
                    <input
                        type="text"
                        value={img3}
                        onChange={(e) => setImg3(e.target.value)}
                    />
                </label>
                <div>--------------------------</div>
                {errors.message && <p>{errors.message}</p>}
                <button
                    type="submit"
                    disabled={Object.values(errors).length || Object.values(imgErrors).length}
                >
                    Create Spot
                </button>
            </form>
        </>
    )
}
export default CreateSpotForm