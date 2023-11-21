import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { createReview } from '../../store/reviews'
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";



const PostReview = ({ spotId}) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();  
    const [reviewText, setReviewText] = useState('Leave your review here...')
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
            setSelected('red')
            setSelected1('black')
            setSelected2('black')
            setSelected3('black')
            setSelected4('black')
        }
        if(stars === 2){
            setSelected('black')
            setSelected1('red')
            setSelected2('black')
            setSelected3('black')
            setSelected4('black')
        }
        if(stars === 3){
            setSelected('black')
            setSelected1('black')
            setSelected2('red')
            setSelected3('black')
            setSelected4('black')
        }
        if(stars === 4){
            setSelected('black')
            setSelected1('black')
            setSelected2('black')
            setSelected3('red')
            setSelected4('black')
        }
        if(stars === 5){
            setSelected('black')
            setSelected1('black')
            setSelected2('black')
            setSelected3('black')
            setSelected4('red')
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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>How was your stay?</h1>
                {/* {errors} */}
                <textarea value={reviewText} onChange={(e)=>setReviewText(e.target.value)}></textarea>
                <div>
                    <div style={{color:selected}} onClick={()=> setStars(1)}>1</div>
                    <div style={{color:selected1}} onClick={()=> setStars(2)}>2</div>
                    <div style={{color:selected2}} onClick={()=> setStars(3)}>3</div>
                    <div style={{color:selected3}} onClick={()=> setStars(4)}>4</div>
                    <div style={{color:selected4}} onClick={()=> setStars(5)}>5</div>
                    stars
                </div>
                <button
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