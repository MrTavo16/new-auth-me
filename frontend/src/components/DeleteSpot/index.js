import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";

const DeleteSpot=({spotId})=>{
    // console.log(spotId)
    const { closeModal } = useModal();
    const dispatch = useDispatch()

    const handleYes = ()=>{
        dispatch(deleteSpot(spotId))
            .then(closeModal)
    }

    return(<div className="all-delete">
        <h1 className="title">Confirm Delete</h1>
        <div className="delete-body">
        <p>Are you sure you want to remove this spot from the listings?</p>
        <div className="yes-button" onClick={handleYes}>Yes {'(Delete Spot)'}</div>
        <div className="no-button" onClick={closeModal}>No {'(Keep Spot)'}</div>
        </div>
    </div>)
}
export default DeleteSpot