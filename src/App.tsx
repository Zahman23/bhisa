import { Outlet } from "react-router-dom";
import Navbar from "./components/global/Navbar";

// import Footer from "./components/global/Footer"

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-white text-gray-900">
      <Navbar />
      <main className="flex-1">
        <div className=" px-4 py-6 mx-auto">
          <Outlet />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
