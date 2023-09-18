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
    const spotImg = await Image.unscoped().findByPk(Number(req.params.imageId),{
        where:{
            imageableType:'SpotPics'
        }
    })
    if(!spotImg)return res.status(404).json({
        "message": "Spot Image couldn't be found"
    })
    const spots = await Spot.findAll({
        include:{model:Image,as:'SpotImages'},
        where:{
            id:spotImg.imageableId
        }
    })

    
    if(spots[0].ownerId === currUser){
        await spotImg.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }else{
        return res.status(400).json({message:'Forbidden'})
    }
})


module.exports = router