import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import Footer from "./components/Footer";
import path from "../../data/storeMusic/titanium.mp3";
import path2 from "../public/troubles.mp3";

export default function Dummy() {
  return (
    <>
      <Panel title="Report an Issue">
        <div>
          <audio
            controls
            autoPlay
            src="../public/troubles.mp3"
            className="w-1/2 focus:outline-none transition-transform duration-300"
          />
        </div>
      </Panel>
      <Footer></Footer>
    </>
  );
}
