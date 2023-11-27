import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { createReview } from '../../store/reviews'
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import './PostReviewForm.css'



const PostReview = ({ spotId}) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();  
    const [reviewText, setReviewText] = useState('')
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({})
    const [selected, setSelected] = useState('black')
    const [selected1, setSelected1] = useState('black')
    const [selected2, setSelected2] = useState('black')
    const [selected3, setSelected3] = useState('black')
    const [selected4, setSelected4] = useState('black')

    useEffect(()=>{
        // console.log(spotId)
        const currErrors = {}
        if(stars === 1){
            setSelected('#ff0000')
            setSelected1('#000000')
            setSelected2('#000000')
            setSelected3('#000000')
            setSelected4('#000000')
        }
        if(stars === 2){
            setSelected('#ff0000')
            setSelected1('#ff0000')
            setSelected2('#000000')
            setSelected3('#000000')
            setSelected4('#000000')
        }
        if(stars === 3){
            setSelected('#ff0000')
            setSelected1('#ff0000')
            setSelected2('#ff0000')
            setSelected3('#000000')
            setSelected4('#000000')
        }
        if(stars === 4){
            setSelected('#ff0000')
            setSelected1('#ff0000')
            setSelected2('#ff0000')
            setSelected3('#ff0000')
            setSelected4('#000000')
        }
        if(stars === 5){
            setSelected('#ff0000')
            setSelected1('#ff0000')
            setSelected2('#ff0000')
            setSelected3('#ff0000')
            setSelected4('#ff0000')
        }
        if(reviewText.length < 10){
            currErrors.reviewText = 'less than 10'
        }
        if((1 > stars|| stars > 5||stars === undefined)){
            currErrors.stars = 'its 0'
        }
        setErrors(currErrors)
    },[stars, reviewText])
    
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createReview({
            spotId:spotId,
            review:reviewText,
            stars:stars
        })).catch(async (res)=>{
            const data = await res.json()
            if(data && data.errors){
                setErrors(data.errors)
            }
        }).then(closeModal)
    }
    // console.log(stars)
    return (
        <div id='post-review-form-div'>
            <form id='post-review-form-div' onSubmit={handleSubmit}>
                <h1>How was your stay?</h1>
                {errors && <p>{errors.message}</p>}
                <textarea id='review-text' value={reviewText} placeholder='Leave your review here...' onChange={(e)=>setReviewText(e.target.value)}></textarea>
                <div className='star-container'>
                Stars
                    <div id='star-five' onClick={()=> setStars(5)}>
                        <span style={{color:selected4}} className="fa-solid fa-star"></span>
                    </div>
                    <div id='star-four'  onClick={()=> setStars(4)}>
                        <span style={{color:selected3}} className="fa-solid fa-star"></span>
                    </div>
                    <div id='star-three'  onClick={()=> setStars(3)}>
                        <span style={{color:selected2}} className="fa-solid fa-star"></span>
                    </div>
                    <div id='star-two'  onClick={()=> setStars(2)}>
                        <span style={{color:selected1}} className="fa-solid fa-star"></span>
                    </div>
                    <div id='star-one' onClick={()=> setStars(1)}>
                        <span className="fa-solid fa-star" style={{color:selected}}></span>
                    </div>
                </div>
                <button
                id='sub-but'
                type="submit"
                disabled={Object.values(errors).length}
                >
                Submit Your Review
                </button>
            </form>
        </div>
    )
}
export default PostReview