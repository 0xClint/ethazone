import React from "react";
import { ethers } from "ethers";
import {
  createNewItem,
  fetchCreatorNFTData,
  fetchLevel,
  fetchNFTData,
  fetchUserItemMetadata,
  getAllNFTsTotalSupplyItemURI,
  listItem,
  mintLevel,
  purchaseItems,
} from "../utils/functionCall";

const Admin = () => {
  const createItem = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await createNewItem(signer, 5, "flower4", "FLW4", "flower4");
  };

  const listonMarket = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await listItem(signer, 4, 10);
  };

  const purchase = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await purchaseItems(signer, 2);
  };

  const getUserNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    // await fetchNFTData(signer);
    await fetchUserItemMetadata(signer);
  };

  const getCreatorNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await fetchCreatorNFTData(signer);
  };

  const getAllNFTsMinted = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    console.log("hello");
    const signer = await provider.getSigner();
    const res = await getAllNFTsTotalSupplyItemURI(signer);
    console.log(res);
  };

  const mintLevelNFT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await mintLevel(signer);
  };

  const getLevel = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await fetchLevel(signer);
  };

  return (
    <div className="adminpage w-screen flex px-20 gap-10 pt-10">
      <div className="w-1/2 make-flex flex-col">
        <button className="btn" onClick={() => createItem()}>
          New Item
        </button>
        <button className="btn" onClick={() => listonMarket()}>
          List Item
        </button>
      </div>
      <div className="w-1/2 make-flex flex-col">
        <button className="btn" onClick={() => purchase()}>
          Purchase
        </button>
        <button className="btn" onClick={() => getUserNFTs()}>
          Fetch User NFTs
        </button>
        <button className="btn" onClick={() => getCreatorNFTs()}>
          Fetch Creator NFTs
        </button>
        <button className="btn" onClick={() => getAllNFTsMinted()}>
          Get all NFTs minted
        </button>
        <button className="btn" onClick={() => mintLevelNFT()}>
          mint level NFT
        </button>
        <button className="btn" onClick={() => getLevel()}>
          fetch level
        </button>
      </div>
    </div>
  );
};

export default Admin;
