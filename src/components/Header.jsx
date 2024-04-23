import React, { useState, useEffect } from "react";
import {
  InfoIcon,
  chatIcon,
  etherzoneLogo,
  gearIcon,
  profileIcon,
  shopIcon,
} from "../assets";
import { useStore } from "../hooks/useStore";
import ConnectWallet from "./ConnectWallet";
import { ethers } from "ethers";
import { saveGame } from "../utils/functionCall";
import Loader from "./Loader";

const Header = ({ isHome }) => {
  const [loader, setLoader] = useState(false);
  const [
    cubes,
    items,
    chatBar,
    setChatBar,
    shopMenu,
    setShopMenu,
    settingMenu,
    setSettingMenu,
    activeWorldID,
    infoBar,
    setInfoBar,
    activeConfig,
    levelMode,
  ] = useStore((state) => [
    state.cubes,
    state.items,
    state.chatBar,
    state.setChatBar,
    state.shopMenu,
    state.setShopMenu,
    state.settingMenu,
    state.setSettingMenu,
    state.activeWorldID,
    state.infoBar,
    state.setInfoBar,
    state.activeConfig,
    state.levelMode,
  ]);

  const saveGameData = async () => {
    setLoader(true);
    const objData = {
      cubes,
      items,
    };
    console.log("worldId: " + activeWorldID);
    console.log(objData);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      await saveGame(signer, activeWorldID, objData);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute z-10 top-0 w-screen flex flex-col">
      <div className="w-full flex text-[2rem] justify-between items-center h-16 px-5 ">
        <div className="flex gap-4 items-center">
          <div className="leading-7 m-0 p-0">
            <img src={etherzoneLogo} className="h-8  " />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          {!isHome ? (
            <div
              // onClick={() => setInfoBar(!infoBar)}
              className="icon-container mr-2"
              style={{ transform: "translateX(15px)" }}
            >
              <span className="absolute text-[6px] m-1 translate-x-[7px] translate-y-[3px] text-white">
                P
              </span>
              <img
                src={profileIcon}

                // className={`${"infoMenu" === activeConfig ? "active" : ""}`}
              />
            </div>
          ) : (
            <ConnectWallet />
          )}
          {!isHome && (
            <button
              className="btn bg-[#7676E2] hover:scale-[102%] text-white"
              onClick={() => saveGameData()}
            >
              Save
            </button>
          )}
        </div>
      </div>

      {loader && <Loader />}
    </div>
  );
};

export default Header;
