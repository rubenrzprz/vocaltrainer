import { Route, Routes, Navigate } from "react-router-dom";
import BreathingRecorderPage from "./BreathingRecorderPage";
import MelodyRecorderPage from "./MelodyRecorderPage";

/**
 * Recorder page
 */
const RecorderPage = () => {
    return (
        <Routes>
            <Route path="/" element={
                <Navigate to="melody"/>
            } />
            <Route path="/breathing" element={
                <BreathingRecorderPage/>
            } />
            <Route path="/melody" element={
                <MelodyRecorderPage/>
            } />
        </Routes>
    )
}

export default RecorderPage;