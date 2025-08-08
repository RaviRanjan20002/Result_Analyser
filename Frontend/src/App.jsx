
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from '../src/component/Layout';
import SetDetails from "../src/component/SetDetails";
import GetDetails from "../src/component/GetDetails";
import BatchResults from './component/BatchResults';
import QuizTestPerformance from './component/QuizTestPerformance';
import CompareWithTopper from './component/CompareWithTopper';
import OverallAnalysis from './component/OverallAnalysis';
import StudentCodesByDate from './component/StudentCodesByDate';
import BatchManagement from './component/BatchManagement';
import RegisterStudent from './component/RegisterStudent';
import ViewStudentCodes from './component/ViewStudentCodes';
const App = () => {
    return (
        <Router>
            <Routes>
                {/* Layout wraps all routes */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<SetDetails/>} /> {/* Default page */}
                    <Route path="result" element={<GetDetails />} />
                    <Route path="StudentCodesByDate" element={<StudentCodesByDate/>} />
                    <Route path="registerStudent" element={<RegisterStudent/>} />
                    <Route path="resultdashboard" element={<BatchResults/>} /> 
                    <Route path="quizanalysis" element={<QuizTestPerformance/>} /> 
                    <Route path="comparision" element={<CompareWithTopper/>} /> 
                    <Route path="graphicalanalysis" element={<OverallAnalysis/>} />
                    <Route path="batch-management" element={<BatchManagement />} /> 
                    <Route path="/view-registered" element={<ViewStudentCodes/>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;