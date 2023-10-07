const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Image, User, Review, Booking } = require('../../db/models')



router.delete('/:imageId',async (req, res)=>{
    const user = req.user
    if(!user)return res.status(401).json({
        "message": "Authentication required"
      })
    const currUser = req.user.id
    const reviewImg = await Image.unscoped().findByPk(Number(req.params.imageId),{
        where:{
            imageableType:'ReviewPics'
        }
    }) 
    console.log(reviewImg,'-------------------------')
    if(!reviewImg){
        return res.status(404).json({
            "message": "Review Image couldn't be found"
          })
    }
    const reviews = await Review.findAll({
        include:{model:Image,as:'ReviewImages'},
        where:{
            id:reviewImg.imageableId
        }
    })
    
    if(reviews[0].userId === currUser){
        await reviewImg.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
          })
    }else{
        return res.status(403).json({message:'Forbidden'})
    }
})



module.exports=router