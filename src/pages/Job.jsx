import { Outlet, useParams } from "react-router-dom";
import { useState, createContext } from "react";

import JobList from "@/components/job/JobList";

export const OverlayContext = createContext()

export default function Job() {
  const { jobId } = useParams();
  //const sideMenuMobile = jobId ? "hidden" : "basis-full";
  //const contentMobile = jobId ? "basis-full" : "hidden";
  // https://stackoverflow.com/questions/57144498/how-to-use-react-context-with-usestate-hook-to-share-state-from-different-compon
  const [overlay, setOverlay] = useState(false)

  return (
    <OverlayContext.Provider value={{setOverlay}}>
      <div className="flex flex-row min-h-screen">
        <div className={`sm: ${overlay?"hidden":"basis-full"} md:block md:basis-1/2 lg:basis-5/12 flex-none h-full`}>
          <JobList/>
        </div>
        <div className={`sm: ${overlay?"basis-full":"hidden"} md:block md:basis-1/2 lg:basis-7/12 flex-none bg-slate-200 h-full`}>
          <Outlet/>
        </div>
      </div>
    </OverlayContext.Provider>
  );
}
