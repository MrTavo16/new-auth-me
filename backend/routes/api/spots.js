const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const  { query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Image, User, Review, Booking } = require('../../db/models')
const { Op } = require('sequelize')

const validateBooking = [
    check("startDate")
      .exists()
      .isISO8601(),
    //   .custom(async (value,{req, location, path} )=>{
    //     const bookings = await Booking.findAll()
    //     bookings.forEach(ele=>{
    //         // console.log(new Date(ele.startDate).toISOString().split('T')[0] === new Date(value).toISOString().split('T')[0],'------------------')
    //         // console.log(new Date(value) >= new Date(ele.startDate),'------------------')
    //         // console.log(new Date(value) <= new Date(ele.endDate),'------------------')
    //         if(!(new Date(ele.startDate).toISOString().split('T')[0] === new Date(value).toISOString().split('T')[0] || (new Date(value) >= new Date(ele.startDate)&& new Date(value) <= new Date(ele.endDate))))return true
    //         else throw new Error("Start date conflicts with an existing booking") 
    //     })
    //   }),
    check("endDate")
    .exists()
    .isISO8601()
    .custom(async (value, {req, location, path})=>{
        if(!(new Date(value) < new Date(req.body.startDate)))return true
        else throw new Error("endDate cannot come before startDate")
    }),
    handleValidationErrors
]

const checkingQueries = [
    query('page')
      .optional({checkFalsy: true})
      .custom(async (value, {req, location, path})=>{
        if(value >= 1)return true
        else throw new Error("Page must be greater than or equal to 1")
      }),
    query('size')
      .optional({checkFalsy: true})
      .custom(async (value, {req, location, path})=>{
        if(value >= 1)return true
        else throw new Error("Size must be greater than or equal to 1")
      }),
    query('minLat')
      .optional({checkFalsy: true})
      .custom(async (value, {req,location, path})=>{
        if((value > req.query.maxLat))return true
        else throw new Error("Minimum latitude is invalid")
      }),
    query('maxLat')
      .optional({checkFalsy: true})
      .custom(async (value, {req,location, path})=>{
        if((value < req.query.minLat))return true
        else throw new Error("Maximum latitude is invalid")
      }),
    query('minLng')
      .optional({checkFalsy: true})
      .custom(async (value, {req,location, path})=>{
        if((value > req.query.maxLat))return true
        else throw new Error("Minimum longitude is invalid")
      }),
    query('maxLng')
      .optional({nullable: true})
      .custom(async (value, {req,location, path})=>{
        console.log(value,'---------value---------')
        if((value < req.query.minLat))return true
        else throw new Error("Maximum longitude is invalid")
      }),
    query('minPrice')
      .optional({nullable: true})
      .custom(async (value, {req, location, path})=>{
        if((value >= 0)) return true
        else throw new Error("Minimum price must be greater than or equal to 0")     
      }),
    query('maxPrice')
      .optional({checkFalsy: true})
      .custom(async (value, {req, location, path})=>{
        if((value >= 0)) return true
        else throw new Error("Maximum price must be greater than or equal to 0")
      }),
    handleValidationErrors
]

const validateReviews = [
  check('review')
    .exists()
    .notEmpty()
    .withMessage("Review text is required"),
  check('stars')
    .isNumeric()
    .custom((value, { req, location, path }) =>{
      if((value >= 1) && (value <= 5))return true
      else throw new Error('Stars must be an integer from 1 to 5')
    })
    .exists()
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

const validateSpots = [
    check('address')
      .exists()
      .withMessage("Street address is required"),
    check('city')
      .exists()
      .withMessage("City is required"),
    check('state')
      .exists()
      .withMessage("State is required"),
    check('country')
      .exists()
      .withMessage("Country is required"),
    check('lat')
      .exists()
      .withMessage("Latitude is not valid"),
    check('lng')
      .exists()
      .withMessage("Longitude is not valid"),
    check('name')
      .exists()
      .withMessage("Name must be less than 50 characters"),
    check('description')
      .exists()
      .withMessage("Description is required"),
    check('price')
      .exists()
      .withMessage("Price per day is required"),
    handleValidationErrors
];


router.post(
    '/',
    validateSpots,
    async (req,res)=>{
        const {address ,city, state, country, lat, lng, name, description, price} = req.body
        const user = req.user
        const numReviews = 0
        const avgStarRating = 0
        if(!user)return res.status(401).json({
          "message": "Authentication required"
        })
        const ownerId = req.user.id
        if(!req.user.id){
            return res.json("Authentication required")
        }
        const spotCheck = await Spot.findOne({
            where:{
                address:req.body.address
            }
        })
        if(spotCheck){
            return res.json({
                message:'address needs to be a unique'
            })
        }
        const spot = await Spot.create({ownerId ,address ,city, state, country, lat, lng, name, description, price, numReviews,avgStarRating })
        const safeSpot = {
            id:spot.id,
            ownerId:spot.ownerId,
            address:spot.address,
            city:spot.city, 
            state:spot.state,
            country:spot.country,
            lat:spot.lat,
            lng:spot.lng,
            name:spot.name, 
            description:spot.description, 
            price:spot.price
        }
        return res.json(safeSpot)
})
router.get('/',checkingQueries,async (req, res)=>{
        let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query
        const pagination = {};
        const searchParams = {}

        if(page&& !isNaN(Number(page))){
          page = Number(page)
        }else{
          page = 1
        }
      
        if(size&& !isNaN(Number(size))){
          size = Number(size)
      
          if(size > 20&&size < 0) size = 20
        }else{
          size = 20
        }

        if(minLat&& !isNaN(Number(minLat))){
            searchParams.lat = {}
            searchParams.lat[Op.gte] = Number(minLat)
        }

        if(maxLat&& !isNaN(Number(maxLat))){
            if(!minLat) searchParams.lat = {}
            searchParams.lat[Op.lte] = Number(maxLat)
        }

        if(minLng&& !isNaN(Number(minLng))){
            searchParams.lng = {}
            searchParams.lng[Op.gte] = Number(minLng)
        }

        if(maxLng&& !isNaN(Number(maxLng))){
            if(!minLng)searchParams.lng = {}
            searchParams.lng[Op.lte] = Number(maxLng)
        }

        if(minPrice&&!isNaN(Number(minPrice))){
            searchParams.price = {}
            searchParams.price[Op.gte] = Number(minPrice)
        }

        if(maxPrice&&!isNaN(Number(maxPrice))){
            if(!minPrice)searchParams.price = {}
            searchParams.price = {[Op.lte]:Number(maxPrice)}
        }
      
        if(size){
          pagination.limit = size
        }
      
        if (page){
          pagination.offset = size * (page - 1)
        }
        // console.log(searchParams,'---------search--------')
        const allSpots = await Spot.findAll({
            where:searchParams,
            ...pagination
        })
        res.json({
            Spots:allSpots,
            page,
            size
        })
    })
    router.get('/current',async(req, res)=>{
        // console.log(req,'-----------------req----------------')
        const user = req.user
        if(!user)return res.status(401).json({
          "message": "Authentication required"
        })
        const currUser = req.user.id
        const allSpots = await Spot.findAll({
            where:{
                ownerId:currUser
            }
        })
        res.json({
            Spots:allSpots
        })
    })

    router.get('/:spotId/reviews',async (req, res)=>{
        // const spotI = Number(req.params.spotId)
        const reviews = await Review.findAll({
            where:{
                spotId:Number(req.params.spotId)
            },
            include:[{model:Image,as:'ReviewImages'}]
        })
        if(!reviews.length){
            return res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }
        return res.status(200).json({
            reviews
        })
    })
    
    router.post('/:spotId/bookings',
        validateBooking,
        async (req, res)=>{
        const endDate = req.body.endDate
        const user = req.user
        if(!user)return res.status(401).json({
          "message": "Authentication required"
        })
        const userId = req.user.id
        const startDate = req.body.startDate
        const bookings = await Booking.findAll()
        bookings.forEach(ele=>{
            if(!(new Date(ele.endDate).toISOString().split('T')[0] === new Date(endDate).toISOString().split('T')[0] || (new Date(endDate) <= new Date(ele.endDate)&& new Date(endDate) >= new Date(ele.startDate))))null
            else return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                  "startDate": "Start date conflicts with an existing booking",
                  "endDate": "End date conflicts with an existing booking"
                }
              })
            
            if(!(new Date(ele.startDate).toISOString().split('T')[0] === new Date(startDate).toISOString().split('T')[0] || (new Date(startDate) >= new Date(ele.startDate)&& new Date(startDate) <= new Date(ele.endDate))))return true
            else return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                  "startDate": "Start date conflicts with an existing booking",
                  "endDate": "End date conflicts with an existing booking"
                }
              })
        })
        const spotId = req.params.spotId
        const spotCheck = await Spot.findByPk(spotId)
        if(!spotCheck){
            return res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }

        if(userId === spotCheck.ownerId)return res.status(403).json({
          "message": "Forbidden"
        })
        const bookingCreated = await Booking.create({spotId, userId, startDate, endDate})
        res.status(200).json(bookingCreated)
    })

    router.get('/:spotId/bookings',async (req, res)=>{
        const spotId = Number(req.params.spotId)
        const user = req.user
        const spot = await Spot.findByPk(spotId)
        if(!spot){
          return res.status(404).json({
            "message": "Spot couldn't be found"
          })
        }
        const bookings = await Booking.findAll({
          include:{model:User},
          where:{
            spotId: spotId
          },
        })
        // console.log(spotId,'--------------------------',currUser)
        const filteredBookings = []
        bookings.forEach(ele=>{
          const filter = {
            spotId:ele.spotId,
            startDate:ele.startDate,
            endDate:ele.endDate
          }
          filteredBookings.push(filter)
        })
        if(!user||user.id !== spot.ownerId){
          return res.status(200).json({
            Bookings:filteredBookings
          })
        }
        
        if(spot.ownerId === req.user.id){
            res.status(200).json({Bookings:bookings})
        }
        
    })
    

router.post('/:spotId/reviews',
      validateReviews,  
      async (req, res)=>{
        const {review, stars} = req.body;
        const spotId = Number(req.params.spotId)
        const user = req.user
        if(!user)return res.status(401).json({
          "message": "Authentication required"
        })
        const userId = req.user.id
        const spotCheck = await Spot.findByPk(spotId,{
          include:{model:Review}
        })
        const userCheck = await User.findByPk(req.user.id,{
            include:{
                model:Review
            }
        })
        if(userCheck.Reviews){
          userCheck.Reviews.forEach(ele => {
            if(ele.spotId === spotId){
                res.status(500).json({
                    "message": "User already has a review for this spot"
                  })
            }
        });  
        }
        
        if(!spotCheck){
            return res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }
        if(review && stars){
          const newReview = await Review.create({userId, spotId, review, stars}) 
          let starCount = 0
          spotCheck.numReviews = spotCheck.numReviews + 1
          await Spot.increment({numReviews:1},{where:{id:spotId}})
          // console.log(spotCheck.numReviews,'----------------spotcheck numReviews-------')
          let numOfRev = spotCheck.numReviews
          spotCheck.Reviews.forEach(ele=>{
            starCount += ele.stars
          })
          starCount += stars
          if(numOfRev === 0 &&starCount === 0){
            spotCheck.numReviews = numOfRev
            spotCheck.avgStarRating = stars
            const newReview = await Review.create({userId, spotId, review, stars}) 
            return res.status(201).json(newReview)
          }
          spotCheck.avgStarRating = starCount/numOfRev
          // console.log(numOfRev,'review num -----------')
          // console.log(starCount,'starCount --------')
          // console.log(starCount/numOfRev)
          // console.log(spotCheck,'----------------spotcheck after-------')

           return res.status(201).json(newReview)
        }
    })

    router.post('/:id/images',async (req, res)=>{
        const imageableId = Number(req.params.id)
        const imageableType = 'SpotPics'
        const user = req.user
        if(!user)return res.status(401).json({
          "message": "Authentication required"
        })
        const spotCheck = await Spot.findByPk(imageableId)
        if(!(spotCheck.ownerId === req.user.id)){
            return res.status(403).json({
              "message": "Forbidden"
            })
        }
        if(!spotCheck){
            return res.status(404).json({
                "message": "Spot couldn't be found"
            })
        }
        const { url} = req.body
        const previewImage = req.body.preview
        const spotImg = await Image.create({url, previewImage, imageableId, imageableType})
        const sortedImg = {
            id :spotImg.id,
            url:spotImg.url,
            preview:spotImg.previewImage
        }
        res.json(sortedImg)
    })

    router.delete('/:spotId',async (req, res)=>{
        const user = req.user
        if(!user)return res.status(401).json({
          "message": "Authentication required"
        })
        const currUser = req.user.id
        const spot = await Spot.findByPk(Number(req.params.spotId))
        if(!spot)return res.status(404).json({
            "message": "Spot couldn't be found"
          })
 
        if(spot.ownerId === currUser){
            await spot.destroy()
            return res.status(200).json({
                "message": "Successfully deleted"
              })
        }else{
            return res.status(401).json({
              "message": "Forbidden"
            })
        }

    })

router.put('/:spotId',
        validateSpots,
        async (req, res)=>{
        const {address ,city, state, country, lat, lng, name, description, price} = req.body
        const spotId = Number(req.params.spotId)
        const spot = await Spot.findByPk(spotId)
        if(!spot){
          res.status(404).json({
            "message": "Spot couldn't be found"
          })
        }
        if(!(spot.ownerId === req.user.id)){
            throw new Error('Only owner can add images')
        }
        if(address){
            spot.address = address
        }
        if(city){
            spot.city = city
        }
        if(state){
            spot.state = state
        }
        if(country){
            spot.country = country
        }
        if(lat){
            spot.lat = lat
        }
        if(lng){
            spot.lng = lng
        }
        if(name){
            spot.name = name
        }
        if(description){
            spot.description = description
        }
        if(price){
            spot.price = price
        }
        return res.json(spot)
    })
    
    router.get('/:spotId',async (req, res)=>{
        const spotId = req.params.spotId
        const spotInfo = await Spot.findByPk(spotId,{
            include:[{model:Image,as:'SpotImages'}, {model:User,as:'Owner'}]
        })
        if(!spotInfo)return res.status(404).json({
          "message": "Spot couldn't be found"
        })
        res.status(200).json({
            spotInfo
        })
    })

module.exports = router