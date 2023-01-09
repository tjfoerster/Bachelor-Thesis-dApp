import { useMetamask } from "../hooks/useMetamask";

export default function Body() {
    const walletConnected = typeof useMetamask().state.wallet === "string";
    
    return (
        <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
            <div>
                <input 
                    type="number"
                    disabled={!walletConnected}
                    className="mt-8 mr-4 inline-flex w-full items-center justify-center rounded-md border border-transparent disabled:opacity-75 text-white px-5 py-3 text-base font-medium sm:w-auto"
                />
                <button
                    disabled={!walletConnected}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-truffle disabled:opacity-75 text-white px-5 py-3 text-base font-medium sm:w-auto"
                >Change value on blockchain</button>
            </div>
            <div className="mt-8">History:</div>
        </div>
    );
}