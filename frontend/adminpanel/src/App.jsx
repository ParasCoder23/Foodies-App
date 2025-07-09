import { useState } from "react"
import Menubar from "./components/Menubar/Menubar"
import Sidebar from "./components/Sidebar/Sidebar"
import AddFood from "./pages/AddFood/AddFood"
import ListFood from "./pages/ListFood/ListFood"
import Orders from "./pages/Orders/Orders"
import{ Route , Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const App = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () =>{
        setSidebarVisible(!sidebarVisible);
    }
  return (
    <div className="d-flex" id="wrapper">
            <Sidebar sidebarVisible={sidebarVisible} />
            <div id="page-content-wrapper">
                <Menubar toggleSidebar={toggleSidebar} />
                <ToastContainer/>
                
                <div className="container-fluid">
                    <Routes>
                        <Route path='/add' element={<AddFood/>}></Route>
                        <Route path='/list' element={<ListFood/>}></Route>
                        <Route path='/orders' element={<Orders/>}></Route>
                    </Routes>
                </div>
            </div>
        </div>
  )
}
export default App