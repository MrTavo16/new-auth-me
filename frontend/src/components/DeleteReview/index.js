import { useDispatch } from "react-redux";
import { deleteReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom'
import '../DeleteSpot/delete.css'


const DeleteReview=({spotId, reviewId})=>{
    // console.log(reviewId)
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

    return(<div className="all-delete">
        <h1 className="title">Confirm Delete</h1>
        <div className="delete-body">
        <p>are you sure you want to delete this review?</p>
        <div className="yes-button" onClick={handleYes}>Yes {'(Delete Review)'}</div>
        <div className="no-button" onClick={closeModal}>No {'(Keep Review)'}</div>
        </div>
    </div>)
}
export default DeleteReview