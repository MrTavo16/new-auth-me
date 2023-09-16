const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Image, User, Review } = require('../../db/models')


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
    const currUser = req.user.id
    const reviewCheck = await Review.findAll({
        where:{
            userId:currUser
        },
        include:[{model:Spot}, {model:Image, as:'ReviewImages'}]
    })
    return res.status(200).json({
        Reviews:reviewCheck
    })
})

router.post('/:reviewId/images',async (req, res)=>{
    const {url} = req.body
    const previewImage = true
    const imageableType = 'ReviewPics'
    const currUser = req.user.id
    const imageableId = Number(req.params.reviewId)
    const reviewAdd = await Review.findByPk(imageableId,{
        include:{model:Image, as:'ReviewImages'}
    })

    if(reviewAdd.ReviewImages.length >= 10) return res.status(403).json({"message": "Maximum number of images for this resource was reached"})
    if(!reviewAdd) return res.status(404).json({message:"Review couldn't be found"})
    if(!(reviewAdd.userId === currUser))throw new Error('only owner can add an image')
    const newImg = await Image.create({url, previewImage, imageableId, imageableType})
    return res.status(200).json({
        id:newImg.id,
        url:newImg.url
    })
})

router.delete('/:reviewId',async (req, res)=>{
    const currUser = req.user.id
    const review = await Review.findByPk(Number(req.params.reviewId))
    if(!review)return res.status(404).json({
        "message": "Review couldn't be found"
      })
    if(review.userId === currUser){
        await review.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
          })
    }else{
        return res.status(400).json({message:'only owner can delete'})
    }
})

router.put('/:reviewId', 
    validateReviews,
    async (req, res)=>{
    const reviewId = Number(req.params.reviewId)
    const reviewCheck = await Review.findByPk(reviewId)
    if(!reviewCheck){
        return res.status(404).json({
            "message": "Review couldn't be found"
          })
    }
    const {review, stars} = req.body
    if(review){
        reviewCheck.review = review
    }
    if(stars){
    reviewCheck.stars = stars
    }
    res.json(reviewCheck)
})





module.exports=router