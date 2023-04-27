import Link from "next/link";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { Loading } from "./Loading";
import truffleConfig from "../truffle-config";
import Web3 from "web3";

export const web3 = new Web3(
  Web3.givenProvider || `http://${truffleConfig.networks.development.host}:${truffleConfig.networks.development.port}`
);

export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();

  const showInstallMetamask =
    status !== "pageNotLoaded" && !isMetamaskInstalled;
  const showConnectButton =
    status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = await web3.eth.requestAccounts();

    if (accounts.length > 0) {
      const balance = await web3.eth.getBalance(accounts[0]);
      dispatch({ type: "connect", wallet: accounts[0], balance });

      // we can register an event listener for changes to the users wallet
      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  return (
    <div className="bg-truffle">
      <div className="mx-auto max-w-7xl items-center justify-between p-6 lg:px-8">

        
          <div className="flex">
            {showConnectButton && (
              <button
                onClick={handleConnect}
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
              >
                {status === "loading" ? <Loading /> : "Connect Wallet"}
              </button>
            )}
            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
              >
                Disconnect
              </button>
            )}
            {showInstallMetamask && (
              <Link href="https://metamask.io/" target="_blank">
                <a className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto">
                  Install Metamask
                </a>
              </Link>
            )}
            {wallet && balance && (
              <div className="ml-3">
                <h3 className="text-lg font-medium leading-6 text-white">
                  Address: <span className="font-bold">{wallet}</span>
                </h3>
                <p className="text-sm text-white">
                  Balance:{" "}
                  <span className="font-bold">
                    {(parseInt(balance) / 1e18).toFixed(4)}{" "}
                    ETH
                  </span>
                </p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
