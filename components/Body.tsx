import { useMetamask } from "../hooks/useMetamask";
import configuration from "../build/contracts/SimpleStorage.json";
import { web3 } from "./Wallet";
import React from "react";

export default function Body() {
    const wallet = useMetamask().state.wallet;
    const walletConnected = typeof wallet === "string";

    const CONTRACT_ADDRESS = configuration.networks['5777'].address;
    const CONTRACT_ABI = configuration.abi as any[];
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    type BlockValue = {
        block: number,
        value: number,
    }

    const [currentValue, setCurrentValue] = React.useState<BlockValue>()
    const updateCurrentValue = async (bN: number) => {
        const number = await contract.methods.get().call();
        setCurrentValue({block: bN, value: number});
    }

    const [lastBlocks, setLastBlocks] = React.useState<BlockValue[]>([]);
    const [updateTrigger, setUpdateTrigger] = React.useState<number>(1);
    React.useMemo(async () => {
        const currentBlockNumber = await web3.eth.getBlockNumber();
        updateCurrentValue(currentBlockNumber);

        let i = currentBlockNumber - 1;
        const newArray: BlockValue[] = [];
        while(i > currentBlockNumber - 10 && i >= 0 ){
            try {
                const number = await contract.methods.get().call(i);
                newArray.push({block: i, value: number});
            } catch (err) {}
            i--;
        }
        setLastBlocks(newArray);
    },[updateTrigger]);
    
    const [inputValue, setInputValue] = React.useState<number>(0);
    const saveInputValue = async () => {
        if(typeof inputValue === "number" && !Number.isNaN(inputValue) && inputValue !== null) {
            await contract.methods.set(inputValue).send({from: wallet, value: 0});
            setUpdateTrigger(updateTrigger + 1);
        }
    }

    return (
        <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
            <div>
                <input 
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(parseInt(e.target.value))}
                    disabled={!walletConnected}
                    className="mt-8 mr-4 inline-flex w-full items-center justify-center rounded-md border border-transparent disabled:opacity-75 bg-secondary text-white px-5 py-3 text-base font-medium sm:w-auto"
                />
                <button
                    onClick={() => saveInputValue()}
                    disabled={!walletConnected}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-truffle disabled:opacity-75 text-white px-5 py-3 text-base font-medium sm:w-auto"
                >Save value on blockchain</button>
            </div>
            {walletConnected && <div className="mt-8 flex flex-col">
                <div className="text-xl mb-2">Current value (Block {currentValue?.block}):</div>
                <div className="text-xl text-truffle font-bold">{currentValue?.value}</div>
                <div className="text-xl mt-8 mb-2">History:</div>
                <table className="table-auto border mx-auto">
                    <tbody>
                    {lastBlocks.map((m) => {
                        return(<tr key={m.block}>
                            <td className="text-right p-1">Block {m.block}:</td>
                            <td className="font-bold text-truffle text-left p-1">{m.value}</td>
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>}
        </div>
    );
}