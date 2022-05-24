import { useDispatch, useSelector } from "react-redux";
import BreathingEditor from "../components/Exercises/BreathingEditor";
import { selectUser } from "../store/reducers/authReducer";
import { saveBreathingExercise } from "../store/reducers/breathingReducer";
import { fetchDashboard } from "../store/reducers/dashboardReducer";

/**
 * Breathing recorder page
 */
const BreathingRecorderPage = () => {
    const dispatch = useDispatch();
    const userData = useSelector(selectUser)
    /**
     * Saves a publication
     * @param {*} publication
     */
    const onSubmit = async (publication, {resetForm}) => {
        try {
            dispatch(saveBreathingExercise(publication));
            resetForm({})
            dispatch(fetchDashboard(userData.userId));
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <BreathingEditor onSubmit={onSubmit} buttonText="Save"/>
        </>
    )
}

export default BreathingRecorderPage;