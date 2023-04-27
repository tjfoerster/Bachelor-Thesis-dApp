import type { NextPage } from "next";
import React from "react";
import Body from "../components/Body";
import Wallet from "../components/Wallet";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";

const Home: NextPage = () => {
  const { dispatch } = useMetamask();
  const listen = useListen();

  React.useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";
      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      // user was previously connected, start listening to MM
      if (local) {
        listen();
      }

      // local could be null if not present in LocalStorage
      const { wallet, balance } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null };

      dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
    }
  }, []);

  return (
    <>
      <header>
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="block">Zahlungsmittelbestand DApp-Prototyp</span>
              </h2>
            </a>
          </div>
        </nav>
      </header>
      <Wallet />
      <Body />
    </>
  );
};

export default Home;
