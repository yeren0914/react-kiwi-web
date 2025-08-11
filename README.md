# Kiwi Web SDK Demo

This project demonstrates how to use the `@kasplex/kiwi-web` SDK to interact with the Kaspa blockchain, including wallet creation, transactions, and KRC-20 token operations.

## Features

- Generate mnemonic phrases and derive wallet addresses
- Send KAS transactions on the Kaspa testnet
- Mint KRC-20 tokens
- View transaction details

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

## Available Scripts

### `npm start`

Runs the app in development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## SDK Usage Examples

### Initialize SDK

```javascript
import { initialize, Kiwi, Rpc, Wasm } from '@kasplex/kiwi-web';

// 1. Initialize WASM
await initialize('/kaspa_bg.wasm');

// 2. Set network type (Testnet/Mainnet)
await Kiwi.setNetwork(Wasm.NetworkType.Testnet);

// 3. Connect to Kaspa nodes
await Rpc.setInstance(Wasm.NetworkType.Testnet).connect();
```

### Create Wallet

```javascript
import { Mnemonic, Wallet, Wasm } from '@kasplex/kiwi-web';

// Generate 12-word mnemonic
const mnemonic = Mnemonic.random(12);

// Create wallet from mnemonic
const wallet = Wallet.fromMnemonic(mnemonic);

// Get first address
const address = wallet.toAddress(Wasm.NetworkType.Testnet);

// Get private key
const privateKey = wallet.toPrivateKey();

// Get public key
const publicKey = wallet.toPublicKey();
```

### Send Transaction

```javascript
import { KaspaTransaction, Wasm } from '@kasplex/kiwi-web';

const privateKey = new Wasm.PrivateKey('your-private-key-here');
const toAddress = 'recipient-address';
const amount = '1.23456789'; // in KAS
const fee = 10000n; // fee in sompi

const txid = await KaspaTransaction.transferKas(
  privateKey,
  toAddress,
  amount,
  fee
);
```

### Mint KRC-20 Token

```javascript
import { KRC20, Utils, Enum } from '@kasplex/kiwi-web';

const krc20data = Utils.createKrc20Data({
  p: "krc-20",
  op: Enum.OP.Mint,
  tick: 'TOKEN', // Token ticker
});

const privateKey = new Wasm.PrivateKey('your-private-key-here');
const fee = 100000n; // fee in sompi

const txid = await KRC20.mint(privateKey, krc20data, fee);
```

## Project Structure

- `src/App.tsx` - Main application component with all demo functionality
- `src/utils/utils.ts` - Utility functions
- `webpack.config.js` - Webpack configuration
- `public/` - Contains static files including WASM binary

## Dependencies

- `@kasplex/kiwi-web` - Kaspa blockchain interaction SDK
- `react` - UI library
- `antd` - UI component library
- `webpack` - Module bundler

## License

MIT