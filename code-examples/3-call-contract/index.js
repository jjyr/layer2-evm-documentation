const Web3 = require('web3');
const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");

/**
 * BEFORE USING THIS SCRIPT MAKE SURE TO REPLACE:
 * - <YOUR_CONTRACT_ABI>
 * - <YOUR_CONTRACT_ADDRESS>
 * - CONTRACT_ADDRESS variable value
 * - YOUR_READ_FUNCTION_NAME method name
 * - YOUR_WRITE_FUNCTION_NAME method name
 */

// const ACCOUNT_PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000'; // Replace this with your Ethereum private key with funds on Layer 2.
const CONTRACT_ABI = require("./IERC20.json").abi; // this should be an Array []
const CONTRACT_ADDRESS = '0x9D9599c41383D7009C2093319d576AA6F89A4449';

const polyjuiceConfig = {
    web3Url: 'https://mainnet.godwoken.io/rpc',
    abiItems: CONTRACT_ABI
};
  
const provider = new PolyjuiceHttpProvider(
    polyjuiceConfig.web3Url,
    polyjuiceConfig,
);

const web3 = new Web3(provider);

web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
// const account = web3.eth.accounts.wallet.add(ACCOUNT_PRIVATE_KEY);
web3.eth.Contract.setProvider(provider, web3.eth.accounts);

async function readCall() {
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const callResult = await contract.methods.balanceOf("0x085a61d7164735FC5378E590b5ED1448561e1a48").call({
        // from: account.address
    });

    console.log(`Read call result: ${callResult}`);
}

async function writeCall() {
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const tx = contract.methods.transfer(account.address, 2222).send(
        {
            from: account.address,
            gas: 6000000
        }
    );

    tx.on('transactionHash', hash => console.log(`Write call transaction hash: ${hash}`));

    const receipt = await tx;

    console.log('Write call transaction receipt: ', receipt);
}

(async () => {
    const balance = BigInt(await web3.eth.getBalance("0x085a61d7164735FC5378E590b5ED1448561e1a48"));

    console.log(balance);

    if (balance === 0n) {
        console.log(`Insufficient balance. Can't issue a smart contract call. Please deposit funds to your Ethereum address: ${account.address}`);
        return;
    }

    console.log('Calling contract...');

    // Check smart contract state before state change.
    await readCall();

    // Change smart contract state.
    // await writeCall();

    // Check smart contract state after state change.
    await readCall();
})();
