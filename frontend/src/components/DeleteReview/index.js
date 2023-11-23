import { useDispatch } from "react-redux";
import { deleteReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom'


const DeleteReview=({spotId, reviewId})=>{
    console.log(reviewId)
    const history = useHistory()
    const { closeModal } = useModal();
    const dispatch = useDispatch()

    const handleYes = ()=>{
        dispatch(deleteReview(reviewId))
        .then(()=>{
            history.push(`/spots/${spotId}`)
        })
        .then(closeModal)
    }

    return(<div>
        <h1>Confirm Delete</h1>
        <p>are you sure you want to delete this review?</p>
        <div onClick={handleYes}>Yes {'(Delete Review)'}</div>
        <div onClick={closeModal}>No {'(Keep Review)'}</div>
    </div>)
}
export default DeleteReview