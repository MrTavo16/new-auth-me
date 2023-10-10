const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const  { query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Image, User, Review, Booking } = require('../../db/models')
const { Op } = require('sequelize')
const { requireAuth } = require('../../utils/auth')

const validateBooking = [
    check("startDate")
      .exists()
      .isISO8601(),
    check("endDate")
    .exists()
    .isISO8601()
    .custom(async (value, {req, location, path})=>{
        if(!(new Date(value) <= new Date(req.body.startDate)))return true
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
      .custom((value,{req, location, path})=>{
        if(value >= -90 && value <= 90)return true
        else throw new Error("Minimum latitude is  invalid")
      }),
    query('maxLat')
      .optional({checkFalsy: true})
      .custom((value,{req, location, path})=>{
        if(value >= -90 && value <= 90)return true
        else throw new Error("Maximum latitude is  invalid")
      }),
    query('minLng')
      .optional({checkFalsy: true})
      .custom((value,{req, location, path})=>{
        if(value >= -180 && value <= 180)return true
        else throw new Error("Minimum longitude is invalid")
      }),
    query('maxLng')
      .optional({nullable: true})
      .custom((value,{req, location, path})=>{
        if(value >= -180 && value <= 180)return true
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
      .exists({checkNull:true,checkFalsy:true})
      .withMessage("Street address is required"),
    check('city')
      .exists({checkNull:true,checkFalsy:true})
      .withMessage("City is required"),
    check('state')
      .exists({checkNull:true,checkFalsy:true})
      .withMessage("State is required"),
    check('country')
      .exists({checkNull:true,checkFalsy:true})
      .withMessage("Country is required"),
    check('lat')
      .exists({checkNull:true,checkFalsy:true})
      .custom((value,{req, location, path})=>{
        if(value >= -90 && value <= 90)return true
        else throw new Error("Latitude is not valid")
      })
      .withMessage("Latitude is not valid"),
    check('lng')
      .exists({checkNull:true,checkFalsy:true})
      .custom((value,{req, location, path})=>{
        if(value >= -180 && value <= 180)return true
        else throw new Error("Longitude is not valid")
      })
      .withMessage("Longitude is not valid"),
    check('name')
      .exists({checkNull:true,checkFalsy:true})
      .custom((value,{req, location, path})=>{
        if(!(value.length >= 50))return true
        else throw new Error("Name must be less than 50 characters")
      })
      .withMessage("Name must be less than 50 characters"),
    check('description')
      .exists({checkNull:true,checkFalsy:true})
      .withMessage("Description is required"),
    check('price')
      .custom((value,{req, location, path})=>{
        if(value>0)return true
        else throw new Error('Price per day is required')
      })
      .exists({checkNull:true,checkFalsy:true})
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
        const allSpots = await Spot.unscoped().findAll({
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
        const allSpots = await Spot.unscoped().findAll({
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
            include:[{model:User},{model:Image,as:'ReviewImages'}]
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
        const spotId = Number(req.params.spotId)
        const userId = req.user.id
        const startDate = req.body.startDate
        const spotCheck = await Spot.findByPk(spotId)
        if(!spotCheck){
          return res.status(404).json({
              "message": "Spot couldn't be found"
           })
         }
              
        if(userId === spotCheck.ownerId)return res.status(403).json({
            "message": "Forbidden"
        })
        const bookings = await Booking.findAll({
          where:{
            spotId:spotId
          }
        })

        if(!bookings.length){
          const bookingCreated = await Booking.create({spotId, userId, startDate, endDate})
          return res.status(200).json(bookingCreated)
        }
        // for(let i = 0;i < bookings.length;i++){
        //   let currBooking = bookings[i]
        //   if(!(new Date(currBooking.startDate).getDate() === new Date(startDate).getDate() ||new Date(currBooking.endDate).getDate() === new Date(startDate).getDate()
        //   || ((new Date(startDate) > new Date(currBooking.startDate)&& new Date(startDate) < new Date(currBooking.endDate))//---------
        //   ||(new Date(startDate) > new Date(currBooking.startDate)&& new Date(startDate) < new Date(currBooking.endDate)))))continue
        //   else if(!(new Date(currBooking.endDate).getDate() === new Date(endDate).getDate() ||new Date(currBooking.startDate).getDate() === new Date(endDate).getDate()
        //   || ((new Date(endDate) > new Date(currBooking.startDate)&& new Date(endDate) < new Date(currBooking.endDate))
        //   ||(new Date(endDate) > new Date(currBooking.startDate)&& new Date(endDate) < new Date(currBooking.endDate)))))continue
        //   else return res.status(400).json({
        //     "message": "Sorry, this spot is already booked for the specified dates",
        //     "errors": {
        //       "startDate": "Start date conflicts with an existing booking",
        //       "endDate": "End date conflicts with an existing booking"
        //     }
        //   })
        // }
        for (let i = 0; i < bookings.length; i++) {
          let currBooking = bookings[i];
          let bookingStart = new Date(currBooking.startDate);
          let bookingEnd = new Date(currBooking.endDate);
      
          if ((bookingStart > new Date(endDate) || bookingEnd < new Date(startDate))) {
              continue;
          } else {
              return res.status(403).json({
                  "message": "Sorry, this spot is already booked for the specified dates",
                  "errors": {
                      "startDate": "Start date conflicts with an existing booking",
                      "endDate": "End date conflicts with an existing booking"
                  }
              });
          }
      }
        const bookingCreated = await Booking.create({spotId, userId, startDate, endDate})
        return res.status(200).json(bookingCreated)
    })

    router.get('/:spotId/bookings',async (req, res)=>{
        const spotId = Number(req.params.spotId)
        const user = req.user
        const spot = await Spot.findByPk(spotId)
        if(!user){
          res.status(401).json({
            "message": "Authentication required"
          })
        }
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
        
        if(!spotCheck){
            return res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }
        const userCheck = await User.findByPk(userId,{
          include:{
            model:Review
          }
        })
        if(userCheck.Reviews.length){
          for(let i = 0;i < userCheck.Reviews.length;i++){
            const rev = userCheck.Reviews[i]
            if(rev.spotId === spotId){
              return res.status(500).json({
                "message": "User already has a review for this spot"
              })
            }
          }
        //   userCheck.Reviews.forEach(ele => {
        //     if(ele.spotId === spotId){
        //         return res.status(500).json({
        //             "message": "User already has a review for this spot"
        //           })
        //     }
        // });  
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
          // await spotCheck.update({totalStars:starCount})
          await spotCheck.update({avgStarRating:starCount/numOfRev})
          await spotCheck.save()
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
      const { url} = req.body
      const previewImage = req.body.preview
        if(!user)return res.status(401).json({
          "message": "Authentication required"
        })
        const spotCheck = await Spot.findByPk(imageableId,{
          include:{model:Image, as:'SpotImages'}
        })
        if(!spotCheck){
            return res.status(404).json({
                "message": "Spot couldn't be found"
            })
        }
        if(!(spotCheck.ownerId === req.user.id)){
            return res.status(403).json({
              "message": "Forbidden"
            })
        }
        if(spotCheck.SpotImages.length){
          spotCheck.SpotImages.forEach(async ele=>{
            if(ele.previewImage === true && previewImage === true){
              await ele.update({ previewImage: false })
              await ele.save()
            }
          })

        }
        
        const spotImg = await Image.create({url, previewImage, imageableId, imageableType})
        if(previewImage === true){
          await spotCheck.update({previewImage:url})
          await spotCheck.save()
        }

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
            return res.status(403).json({
              "message": "Forbidden"
            })
        }

    })

router.put('/:spotId',
        validateSpots,
        async (req, res)=>{
        const user = req.user
        if(!user){
          res.status(401).json({
            "message": "Authentication required"
          })
        }
        const {address ,city, state, country, lat, lng, name, description, price} = req.body
        const spotId = Number(req.params.spotId)
        const spot = await Spot.findByPk(spotId)
        if(!spot){
          res.status(404).json({
            "message": "Spot couldn't be found"
          })
        }
        if(!(spot.ownerId === req.user.id)){
          return res.status(403).json({
            "message": "Forbidden"
          })
        }
        if(address){
          await spot.update({address: address})
          await spot.save()
          spot.address = address
        }
        if(city){
          await spot.update({city: city})
          await spot.save()
          spot.city = city
        }
        if(state){
          spot.state = state
          await spot.update({state: state})
          await spot.save()
        }
        if(country){
          spot.country = country
          await spot.update({country: country})
          await spot.save()
        }
        if(lat){
          spot.lat = lat
          await spot.update({lat: lat})
          await spot.save()
        }
        if(lng){
          spot.lng = lng
          await spot.update({lng:lng})
          await spot.save()
        }
        if(name){
          await spot.update({name: name})
          await spot.save()
          spot.name = name
        }
        if(description){
          await spot.update({description:description})
          await spot.save()
          spot.description = description
        }
        if(price){
          await spot.update({price: price})
          await spot.save()
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
        res.status(200).json(spotInfo)
    })

module.exports = router