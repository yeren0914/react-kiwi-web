import React, { useEffect, useState } from 'react';
import { Kiwi, KRC20, Wasm, Utils, Rpc, Mnemonic, Wallet, initialize, KaspaTransaction, Enum, BrowerWallet, WalletApi } from '@kasplex/kiwi-web';

export default function App() {
    const [mnemonic, setMnemonic] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);

    const senKas = async function() {
        if(!address) return;
        const privateKeyStr = '42f75b36a290f6895bd290b8e78384c8b0abe39a065c0c0d7b548fe0bb3a016c'
        const privateKey = await new Wasm.PrivateKey(privateKeyStr)
        const resp = await KaspaTransaction.transferKas(privateKey, address, 130000000n, 10000n)
        console.log('txid', resp)
    }

    const sendMint = async function() { 
        const krc20data = Utils.createKrc20Data({
            p: "krc-20",
            op: Enum.OP.Mint,
            tick: 'TCKFE',
        })
        const privateKeyStr = '42f75b36a290f6895bd290b8e78384c8b0abe39a065c0c0d7b548fe0bb3a016c'
        const privateKey = await new Wasm.PrivateKey(privateKeyStr)
        let txid = await KRC20.mint(privateKey, krc20data, 100000n)
        console.log("Mint txid", txid)
    }

    const getWallet = async () => { 
        const walletList = await BrowerWallet.getBrowerWalletList();
        console.log("walletList", walletList);
        
        // Create and initialize wallet instance
        const wallet = await WalletApi.create('kasware');
        
        // Request account access
        const accounts = await wallet.requestAccounts();
        console.log('Connected accounts:', accounts);
        
        // Get wallet balance
        const balance = await wallet.getBalance();
        console.log('Wallet balance:', balance);
    }

    useEffect(() => {
        const initSDK = async () => {
            try {
                // 1. 初始化 wasm
                await initialize('/kaspa_bg.wasm');

                // 2. 设置主网
                await Kiwi.setNetwork(Wasm.NetworkType.Testnet);

                // 3. 连接 Kaspa 节点
                await Rpc.setInstance(Wasm.NetworkType.Testnet).connect();

                // 4. 生成助记词 & 钱包
                const newMnemonic = Mnemonic.random(12);
                setMnemonic(newMnemonic);

                const mnemonic = Mnemonic.random(12);
                console.log("Generated Mnemonic:", mnemonic);
                let wallet = Wallet.fromMnemonic(mnemonic)
                console.log("Generated Wallet:", wallet);
                const firstAddr = wallet.toAddress(Wasm.NetworkType.Testnet);
                setAddress(firstAddr.toString());

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        initSDK();
    }, []);

    if (loading) return <div style={{ padding: 20 }}>Initializing Kiwi SDK...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1>Kasplex Wallet SDK - Kiwi Web Demo</h1>
            <p><strong>Mnemonic:</strong> {mnemonic}</p>
            <p><strong>First Address:</strong> {address}</p>

            <input type="text" placeholder='' value={address} />
            <button onClick={() => senKas()}>转账</button>
            <button onClick={() => sendMint()}>Mint</button>
            <button onClick={() => getWallet()}>wallet</button>
            

        </div>
    );
}
