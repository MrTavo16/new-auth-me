const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Image, User, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


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

router.get('/current', async (req, res)=>{
    const user = req.user
    if(!user)return res.status(401).json({
        "message": "Authentication required"
      })
    const currUser = req.user.id
    const reviewCheck = await Review.findAll({
        where:{
            userId:currUser
        },
        include:[{model:User},{model:Spot}, {model:Image, as:'ReviewImages'}]
    })
    return res.status(200).json({
        Reviews:reviewCheck
    })
})

router.post('/:reviewId/images',async (req, res)=>{
    const {url} = req.body
    const previewImage = true
    const user = req.user 
    if(!user)return res.status(401).json({
        "message": "Authentication required"
      })
    const imageableType = 'ReviewPics'
    const currUser = req.user.id
    const imageableId = Number(req.params.reviewId)
    const reviewAdd = await Review.findByPk(imageableId,{
        include:{model:Image, as:'ReviewImages'}
    })
    if(!reviewAdd) return res.status(404).json({message:"Review couldn't be found"})
    if(reviewAdd.ReviewImages.length >= 10) return res.status(403).json({"message": "Maximum number of images for this resource was reached"})
    if(!(reviewAdd.userId === currUser))return res.status(401).json({
      "message": "Authentication required"
    })
    const spotCheck = await Spot.findByPk(reviewAdd.spotId)
    if(!spotCheck)return res.status(404).json({
      "message": "Spot couldn't be found"
    })
    const newImg = await Image.create({url, previewImage, imageableId, imageableType})
    return res.status(200).json({
        id:newImg.id,
        url:newImg.url
    })
})

router.delete('/:reviewId',async (req, res)=>{
    const user = req.user
    if(!user)return res.status(401).json({
        "message": "Authentication required"
      })
    const currUser = req.user.id
    const review = await Review.findByPk(Number(req.params.reviewId))
    if(!review)return res.status(404).json({
        "message": "Review couldn't be found"
      })
    const spot = await Spot.findByPk(review.spotId)

    await Spot.decrement({numReviews: 1}, { where: { id: review.spotId} })
    console.log(spot.numReviews)
    if(review.userId === currUser){
        await review.destroy()
        await Review.destroy({where:{id:Number(req.params.reviewId)},force:true})
        return res.status(200).json({
            "message": "Successfully deleted"
          })
    }else{
        return res.status(403).json({message:'Forbidden'})
    }
})

router.put('/:reviewId', 
    validateReviews,
    async (req, res)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({
          "message": "Authentication required"
        })
    }
    
    const reviewId = Number(req.params.reviewId)
    const reviewCheck = await Review.findByPk(reviewId)
    if(!reviewCheck){
        return res.status(404).json({
            "message": "Review couldn't be found"
          })
    }
    if(!(user.id === reviewCheck.userId)){
        return res.status(403).json({
            "message": "Forbidden"
          })
    }
    const {review, stars} = req.body
    if(review){
      reviewCheck.review = review
      await reviewCheck.update({review:review})
      await reviewCheck.save()
    }
    if(stars){
      reviewCheck.stars = stars
      await reviewCheck.update({stars:stars})
      await reviewCheck.save()
    }
    return res.json(reviewCheck)
})





module.exports=router