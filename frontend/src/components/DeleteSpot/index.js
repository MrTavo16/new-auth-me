import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";

const DeleteSpot=({spotId})=>{
    console.log(spotId)
    const { closeModal } = useModal();
    const dispatch = useDispatch()

    const handleYes = ()=>{
        dispatch(deleteSpot(spotId))
            .then(closeModal)
    }

    return(<div>
        <h1>Confirm Delete</h1>
        <p>are you sure you want to remove this spot from the listings?</p>
        <div onClick={handleYes}>Yes {'(Delete Spot)'}</div>
        <div onClick={closeModal}>No {'(Keep Spot)'}</div>
    </div>)
}
export default DeleteSpot