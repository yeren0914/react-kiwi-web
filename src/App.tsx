import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Col, Row, Divider, Empty } from 'antd';
import { Kiwi, KRC20, Wasm, Utils, Rpc, Mnemonic, Wallet, initialize, KaspaTransaction, Enum, BrowerWallet, WalletApi } from '@kasplex/kiwi-web';
import { toTokenUnits } from './utils/utils'

export default function App() {
  const [mnemonic, setMnemonic] = useState('');
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [txid, setTxid] = useState('');
  const [mintTxid, setMintTxid] = useState('');
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [transLoading, seyTransLoading] = useState(false);
  const [form] = Form.useForm();

  const privateKeyStr = '65be10f83ff6fce491dda3294d88e56d902efb78a2de5de321b5b94436846bda'
  const fromAddress = 'kaspatest:qqqnzj6kwd3huzeakmhkmrsz6g2dja7uv3h0vu6n4h55epy9yjn7yhx7u88mq'

  // Create mnemonic words
  const createMnemonic = async function () {
    const newMnemonic = Mnemonic.random(12);
    setMnemonic(newMnemonic);

    let wallet = Wallet.fromMnemonic(newMnemonic)
    const firstAddr = wallet.toAddress(Wasm.NetworkType.Testnet);
    setAddress(firstAddr.toString())

    const privateKey = wallet.toPrivateKey();
    setPrivateKey(privateKey)

    const publicKey = wallet.toPublicKey();
    setPublicKey(publicKey.toString())
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToAddress(e.target.value);
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const sendKas = async function () {
    if (!toAddress || !amount) return 'Please input to address and amount'
    try {
      seyTransLoading(true)
      const formatAmount = toTokenUnits(amount, '8')
      console.log('formatAmount', formatAmount)
      const privateKey = await new Wasm.PrivateKey(privateKeyStr)
      const txid = await KaspaTransaction.transferKas(privateKey, toAddress, formatAmount, 10000n)
      setTxid(txid!)
    } finally {
      seyTransLoading(false)
    }
  }

  const sendMint = async function () {
    if (btnLoading) return
    try {
      setBtnLoading(true)
      const krc20data = Utils.createKrc20Data({
        p: "krc-20",
        op: Enum.OP.Mint,
        tick: 'TCKFE',
      })
      const privateKey = await new Wasm.PrivateKey(privateKeyStr)
      let txid = await KRC20.mint(privateKey, krc20data, 100000n)
      setMintTxid(txid!)
    } finally {
      setBtnLoading(false)
    }
  }

  useEffect(() => {
    const initSDK = async () => {
      try {
        // 1. init wasm
        await initialize('/kaspa_bg.wasm');

        // 2. Set up testing network
        await Kiwi.setNetwork(Wasm.NetworkType.Testnet);

        // 3. Connect Kaspa nodes
        await Rpc.setInstance(Wasm.NetworkType.Testnet).connect();
        console.log('Connected to Kaspa nodes')
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
    <>
      <Row>
        <Col span={16} offset={4}>
          <Card title="Create Mnemonic Words " extra={
            <Button color="cyan" onClick={() => createMnemonic()} variant="solid">Create Mnemonic</Button>}>
            {
              mnemonic ?
                <div>
                  <p>
                    <span>Mnemonic：</span>
                    <strong>{mnemonic}</strong>
                  </p>
                  <p>
                    <span>Address：</span>
                    <strong>{address}</strong>
                  </p>
                  <p>
                    <span>PrivateKey：</span>
                    <strong>{privateKey}</strong>
                  </p>
                  <p>
                    <span>PublicKey：</span>
                    <strong>{publicKey} </strong>
                  </p>
                </div>
                : <Empty />
            }
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={16} offset={4}>
          <Card title="Mint Test " extra={
            <Button color="cyan" onClick={() => sendMint()} variant="solid" loading={btnLoading} >Mint</Button>}>
            {
              mintTxid ?
                <div>
                  <p>
                    <span>Mint Txid：</span>
                    <strong>{mintTxid}</strong>
                  </p>
                </div>
                : <Empty />
            }
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={16} offset={4}>
          <Card title="Transaction test" >
            <Form form={form} layout="horizontal">
              <Form.Item label="Address">
                <Input placeholder="Please enter the testing environment address" onChange={handleAddressChange} allowClear />
              </Form.Item>
              <Form.Item label="Amount">
                <Input placeholder="Please enter the amount" onChange={handleAmountChange} allowClear />
              </Form.Item>
              {
                txid ?
                  <Form.Item label="txid">
                    <span>{txid}</span>
                  </Form.Item> : null
              }
              <Form.Item>
                <Button color="cyan" onClick={() => sendKas()} loading={ transLoading}  variant="solid">Submit</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
