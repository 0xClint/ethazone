import React, { useEffect } from "react";
import { useChain, useMoralis } from "react-moralis";
import { profileIcon } from "../assets";

const ConnectWallet = () => {
  const { switchNetwork, chainId, chain } = useChain();
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    deactivateWeb3,
    Moralis,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;

    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
    }
  }, []);

  useEffect(() => {
    // Moralis
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, []);
  return (
    <div className="flex justify-center  items-center">
      {account ? (
        <div className="flex gap-2 justify-center items-center">
          <form class="max-w-sm mx-auto">
            <select
              onChange={(e) => switchNetwork(e.target.value)}
              class=" text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>chain</option>
              <option value="0x1">Etheruem</option>
              <option value="0x89">Polygon</option>
            </select>
          </form>
          <div className="btn flex items-center gap-2 bg-[#7676E2] hover:scale-[102%] ">
            <img src={profileIcon} className="w-6" />
            {`${account.slice(0, 4)}..${account.slice(account.length - 4)}`}
          </div>
        </div>
      ) : (
        <button
          className="btn hover:scale-[102%]"
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
