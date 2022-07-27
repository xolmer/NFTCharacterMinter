import { useState, useEffect, ImgHTMLAttributes } from "react";
import { nftContractAddress } from "../config.js";
import { ethers } from "ethers";
import axios from "axios";

import * as Loader from "react-loader-spinner";

import NFT from "../utils/NFT.json";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
interface IProps {
  loading?: React.ReactNode;
  error?: React.ReactNode;
}
type T = any;

const mint = () => {
  const [mintedNFT, setMintedNFT] = useState<T>(null);
  const [miningStatus, setMiningStatus] = useState<"idle" | "mining" | "minted" | any>(null);
  const [loadingState, setLoadingState] = useState<number>(0);
  const [txError, setTxError] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("Got the ethereum obejct: ", ethereum);
    } else {
      console.log("No Wallet found. Connect Wallet");
    }

    const accounts: any = await ethereum?.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      console.log("Found authorized Account: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No authorized account found");
    }
  };

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum }: any = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const rinkebyChainId = "0x4";

      const devChainId = 1337;
      const localhostChainId = `0x${Number(devChainId).toString(16)}`;

      if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
        alert("You are not connected to the Rinkeby Testnet!");
        return;
      }

      const accounts: any = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum?.request({ method: "eth_chainId" });
    console.log("Connected to chain:" + chainId);

    const rinkebyChainId = "0x4";

    const devChainId = 1337;
    const localhostChainId = `0x${Number(devChainId).toString(16)}`;

    if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkCorrectNetwork();
  }, []);

  // Creates transaction to mint NFT on clicking Mint Character button
  const mintCharacter = async () => {
    try {
      const { ethereum }: any = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nftContractAddress, NFT.abi, signer);

        let nftTx = await nftContract.createXolmerNFT();
        console.log("Mining....", nftTx.hash);
        setMiningStatus(0);

        let tx = await nftTx.wait();
        setLoadingState(1);
        console.log("Mined!", tx);
        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`);

        getMintedNFT(tokenId);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error minting character", error);
      setTxError(error.message);
    }
  };

  // Gets the minted NFT data
  const getMintedNFT = async (tokenId: any) => {
    try {
      const { ethereum }: any = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nftContractAddress, NFT.abi, signer);

        let tokenUri = await nftContract.tokenURI(tokenId);
        let data = await axios.get(tokenUri);
        let meta = data.data;

        setMiningStatus(1);
        setMintedNFT(meta.image);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setTxError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center pt-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-[#d3d3d3] min-h-screen">
      <div className="trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out">
        <svg id="logo-58" width="80" height="80" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="stroke" d="M25 43.94H14.06L10.86 38.39L8.28998 33.94L10.86 29.48" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M10.86 29.4801H5.7L3.13 25.0001L6.77 18.6901L8.27001 16.1001L10.87 11.6101L13.44 7.15006L14.06 6.06006H25" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M25 39.48H16.64L13.44 33.94L10.86 29.48L13.47 25H8.28003L11.95 18.63L13.44 16.06L16.01 11.61L16.64 10.52H25" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M25 15.01H19.23L13.47 25L19.23 34.99H25" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M8.28001 25L5.70001 29.48" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M44.3 29.48L41.72 25" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M25 43.94H35.94L39.14 38.39L41.71 33.94L39.14 29.48" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M39.14 29.4801L44.31 29.4401L46.87 25.0001L43.23 18.6901L41.73 16.1001L39.13 11.6101L36.56 7.15006L35.94 6.06006H25" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M25 39.48H33.36L36.56 33.94L39.14 29.48L36.53 25H41.72L38.05 18.63L36.56 16.06L33.99 11.61L33.36 10.52H25" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M25 15.01H30.77L36.53 25L30.77 34.99H25" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M19.23 15.01L16.64 10.52" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
          <path className="stroke" d="M30.77 15.01L33.36 10.52" stroke="#dddddd" stroke-width="0.5" stroke-miterlimit="10"></path>
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-20 mt-12">Mint your Xolmer NFT!</h2>
      {currentAccount === "" ? (
        <button className="text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <button className="text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6ef8be] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out" onClick={mintCharacter}>
          Mint Character
        </button>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>----------------------------------------</div>
          <div>Please connect to the Rinkeby Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}

      <div className="text-xl font-semibold mb-20 mt-4">
        <a href={`https://rinkeby.rarible.com/collection/${nftContractAddress}`} target="_blank">
          <span className="hover:underline hover:underline-offset-8 ">View Collection on Rarible</span>
        </a>
      </div>
      {loadingState === 0 ? (
        miningStatus === 0 ? (
          txError === null ? (
            <div className="flex flex-col justify-center items-center">
              <div className="text-lg font-bold">Processing your transaction</div>
              <>
                <Loader.TailSpin />
              </>
            </div>
          ) : (
            <div className="text-lg text-red-600 font-semibold">{txError}</div>
          )
        ) : (
          <div></div>
        )
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="font-semibold text-lg text-center mb-4">Your Xolmer NFT Character</div>
          <img src={mintedNFT} alt="" className="h-60 w-60 rounded-lg shadow-2xl shadow-[#6FFFE9] hover:scale-105 transition duration-500 ease-in-out" />
        </div>
      )}
    </div>
  );
};

export default mint;
