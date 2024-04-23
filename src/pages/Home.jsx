import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  createNewWorld,
  fetchGameData,
  fetchLevel,
} from "../utils/functionCall";
import { Header, Loader } from "../components";
import {
  bgImg,
  etherzoneLogo,
  landImg,
  landsImg,
  settingIcon,
} from "../assets";
import { useMoralis } from "react-moralis";
import { useStore } from "../hooks/useStore";

const Home = () => {
  const { isWeb3Enabled } = useMoralis();
  const [loader, setLoader] = useState(false);
  const [controlMenu, setControlMenu] = useState(false);
  const [loadGame, setLoadGame] = useState(false);
  const [worldList, setWorldList] = useState([]);
  const [newWorldMenu, setNewWorldMenu] = useState(false);
  const [worldName, setWorldName] = useState("");
  // const [worldID, setWorldID] = useState("");
  const [worldDescription, setWorldDescription] = useState("");
  const navigate = useNavigate();

  const [setActiveWorldID, setLevel] = useStore((state) => [
    state.setActiveWorldID,
    state.setLevel,
  ]);

  const createWorld = async () => {
    if (worldName && worldDescription) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      // await fetchWorld(signer);

      try {
        setLoader(true);
        const CID = await createNewWorld(signer, worldName, worldDescription);
        const _worldList = await fetchGameData(signer);
        setActiveWorldID(Number(_worldList[1][_worldList[0].length - 1]._hex));
        setTimeout(() => {
          navigate(`/world/${CID}`);
          setLoader(false);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getLevelcompleted();
  }, [isWeb3Enabled]);

  const getLevelcompleted = async () => {
    if (isWeb3Enabled) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setLevel(await fetchLevel(signer));
        setLoader(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchWorld = async () => {
    try {
      setLoader(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setWorldList(await fetchGameData(signer));
      setLoadGame(true);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(worldList);

  return (
    <div className="homepage">
      {newWorldMenu && (
        <div className="control setting menu absolute h-screen w-screen make-flex ">
          <div className="">
            <div
              className="absolute w-[500px] -translate-x-1 translate-y-1  text-white make-flex justify-end px-2 pt-2 cursor-pointer"
              onClick={() => setNewWorldMenu(false)}
            >
              <span>X</span>
            </div>
            <div className="z-100 gameloader-container w-[500px] min-h-[200px] bg-[#9b9b9bcb] py-7 card-container make-flex justify-start flex-col gap-3 px-7">
              <div className="w-full">
                <label className="">Name of World</label>
                <input
                  type="text"
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value)}
                  className="border-2 mt-1 border-black w-full px-1 text-xl text-black h-10 rounded-md font-vt"
                />
              </div>
              <div className="w-full">
                <label>Description</label>
                <textarea
                  value={worldDescription}
                  onChange={(e) => setWorldDescription(e.target.value)}
                  className="border-2 mt-1 border-black w-full px-1 text-xl text-black h-20 rounded-md font-vt"
                />
              </div>
              <button
                className="btn py-3 px-6 text-md text-white hover:scale-[102%]"
                onClick={() => createWorld()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {loadGame && (
        <div className="control setting menu absolute h-screen w-screen make-flex">
          <div>
            <div
              className="absolute w-[500px]  make-flex text-white justify-end px-2 pt-2 cursor-pointer"
              onClick={() => setLoadGame(false)}
            >
              <span>X</span>
            </div>
            <ul className=" z-100 gameloader-container w-[500px] bg-[#9b9b9bcb] min-h-[300px] py-12 card-container make-flex justify-start flex-col gap-3 px-7">
              {worldList && worldList[0].length ? (
                worldList[0].map(({ name, description, cid }, index) => {
                  return (
                    <li
                      className=" text-center w-full py-1  cursor-pointer hover:bg-[#e8e8e8]"
                      key={index + 1}
                      onClick={() => {
                        setActiveWorldID(Number(worldList[1][index]._hex));
                        navigate(`/world/${cid}`);
                      }}
                    >
                      {name}
                    </li>
                  );
                })
              ) : (
                <li className=" text-center w-full py-1 bg-[#ececec] cursor-pointer hover:bg-[#e8e8e8]">
                  No world Created Yet
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
      {controlMenu && (
        <div className="control setting menu absolute h-screen w-screen make-flex ">
          <div>
            <div
              className="absolute w-[440px] text-white make-flex justify-end px-2 pt-2 cursor-pointer"
              onClick={() => setControlMenu(false)}
            >
              <span>X</span>
            </div>
            <ul
              className=" z-100 menu-container w-[450px]  py-12 card-container make-flex flex-col gap-3 "
              style={{ backgroundColor: "rgba(144, 144, 232, 0.6)" }}
            >
              <li className=" flex justify-between w-[80%] ">
                <div className="">W</div>
                <div className="">Forward</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">A</div>
                <div className="">Leftward</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">D</div>
                <div className="">Backward</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">S</div>
                <div className="">Forward</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">C</div>
                <div className="">Chatbox</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">Q</div>
                <div className="">Inventory</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">E</div>
                <div className="">Setting</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">B</div>
                <div className="">Buy</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">Space</div>
                <div className="">Jump</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">Click</div>
                <div className="">Build</div>
              </li>
              <li className=" flex justify-between w-[80%]">
                <div className="">Alt+Click</div>
                <div className="">Destroy</div>
              </li>
            </ul>
          </div>
        </div>
      )}
      <img src={bgImg} className="absolute -z-10 h-screen w-screen" />
      <Header isHome={true} />
      <div className="make-flex justify-start pt-28 w-screen h-screen flex-col">
        <img src={etherzoneLogo} className="h-28" />
        <div className="w-screen mx-auto h-[300px] make-flex gap-14">
          <div
            onClick={() => setNewWorldMenu(true)}
            className="make-flex flex-col card-container gap-2 w-[280px] h-[280px] hover:scale-105 text-base"
          >
            <div className="img-container w-[200px] h-[200px] make-flex">
              <img src={landImg} className="" />
            </div>
            <h2 className="text-lg">Enter game</h2>
          </div>
          <div
            onClick={() => fetchWorld()}
            className="make-flex flex-col card-container gap-2 w-[280px] h-[280px] hover:scale-105 text-base"
          >
            <div className="img-container w-[200px] h-[200px] make-flex">
              <img src={landsImg} className="" />
            </div>
            <h2 className="text-lg">Load game</h2>
          </div>
          <div
            onClick={() => setControlMenu(true)}
            className="make-flex flex-col card-container gap-2 w-[280px] h-[280px] hover:scale-105 text-base"
          >
            <div className="img-container w-[200px] h-[200px] make-flex">
              <img src={settingIcon} className="" />
            </div>
            <h2 className="text-lg">Game Settings</h2>
          </div>
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default Home;
