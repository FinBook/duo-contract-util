import Web3 from 'web3';
import { Contract, EventLog } from 'web3/types';
import * as CST from './constants';
import { IEvent } from './types';

const ProviderEngine = require('web3-provider-engine');
const FetchSubprovider = require('web3-provider-engine/subproviders/fetch');
const createLedgerSubprovider = require('@ledgerhq/web3-subprovider').default;
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default;
const Tx = require('ethereumjs-tx');

export enum Wallet {
	None,
	Local,
	MetaMask,
	Ledger
}

export default class Web3Wapper {
	public web3: Web3;
	public wallet: Wallet = Wallet.None;
	public accountIndex: number = 0;
	private live: boolean;
	private provider: string;

	constructor(window: any, source: string, provider: string, live: boolean) {
		this.live = live;
		this.provider = provider;
		if (window && typeof window.web3 !== 'undefined') {
			this.web3 = new Web3(window.web3.currentProvider);
			this.wallet = Wallet.MetaMask;
		} else if (window) {
			this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
			this.wallet = Wallet.None;
		} else {
			this.web3 = new Web3(
				source
					? new Web3.providers.HttpProvider(provider)
					: new Web3.providers.WebsocketProvider(provider)
			);
			this.wallet = Wallet.Local;
		}
	}

	public switchToMetaMask(window: any) {
		if (window && typeof (window as any).web3 !== 'undefined') {
			this.web3 = new Web3((window as any).web3.currentProvider);
			this.wallet = Wallet.MetaMask;
		} else {
			this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
			this.wallet = Wallet.None;
		}

		this.accountIndex = 0;
	}

	public async switchToLedger() {
		const engine = new ProviderEngine();
		const getTransport = () => TransportU2F.create();
		const networkId = this.live ? CST.ETH_MAINNET_ID : CST.ETH_KOVAN_ID;
		const rpcUrl = this.provider;
		const ledger = createLedgerSubprovider(getTransport, {
			networkId,
			accountsLength: 5
		});
		engine.addProvider(ledger);
		engine.addProvider(new FetchSubprovider({ rpcUrl }));
		engine.start();
		const newWeb3 = new Web3(engine);
		const accounts = await newWeb3.eth.getAccounts();
		this.web3 = newWeb3;
		return accounts;
	}

	public onWeb3AccountUpdate(onUpdate: (addr: string, network: number) => any) {
		if (this.wallet !== Wallet.MetaMask) return;

		const store = (this.web3.currentProvider as any).publicConfigStore;
		if (store)
			store.on('update', () => {
				onUpdate(
					store.getState().selectedAddress || '',
					Number(store.getState().networkVersion || '')
				);
			});
	}

	public isReadOnly() {
		return this.wallet === Wallet.None;
	}

	public readOnlyReject() {
		return Promise.reject('Read Only Mode');
	}

	public wrongEnvReject() {
		return Promise.reject('Wrong Env');
	}

	public generateTxString(abi: object, input: any[]): string {
		return this.web3.eth.abi.encodeFunctionCall(abi, input);
	}

	public createTxCommand(
		nonce: number,
		gasPrice: number,
		gasLimit: number,
		toAddr: string,
		amount: number,
		data: string
	) {
		return {
			nonce, // web3.utils.toHex(nonce), //nonce,
			gasPrice: this.web3.utils.toHex(gasPrice),
			gasLimit: this.web3.utils.toHex(gasLimit),
			to: toAddr,
			value: this.web3.utils.toHex(this.web3.utils.toWei(amount.toString(), 'ether')),
			data
		};
	}

	public signTx(rawTx: object, privateKey: string): string {
		try {
			const tx = new Tx(rawTx);
			tx.sign(new Buffer(privateKey, 'hex'));
			return tx.serialize().toString('hex');
		} catch (err) {
			console.log(err);
			return '';
		}
	}

	public getGasPrice() {
		return this.web3.eth.getGasPrice();
	}

	public async ethTransferRaw(
		from: string,
		privatekey: string,
		to: string,
		amt: number,
		nonce: number
	) {
		if (this.wallet !== Wallet.Local) return this.wrongEnvReject();

		const rawTx = {
			nonce: nonce,
			gasPrice: this.web3.utils.toHex((await this.getGasPrice()) || CST.DEFAULT_GAS_PRICE),
			gasLimit: this.web3.utils.toHex(23000),
			from: from,
			to: to,
			value: this.web3.utils.toHex(this.web3.utils.toWei(amt.toPrecision(3) + '', 'ether'))
		};
		return this.web3.eth
			.sendSignedTransaction('0x' + this.signTx(rawTx, privatekey))
			.then(receipt => console.log(JSON.stringify(receipt, null, 4)));
	}

	public async tokenTransferRaw(
		tokenAddress: string,
		address: string,
		privateKey: string,
		to: string,
		value: number,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		console.log(
			'the account ' +
				address +
				' privateKey is ' +
				privateKey +
				' transfering token (' +
				tokenAddress +
				') to ' +
				to +
				' with amt ' +
				value
		);
		nonce = nonce === -1 ? await this.web3.eth.getTransactionCount(address) : nonce;
		const abi = {
			name: 'transfer',
			type: 'function',
			inputs: [
				{
					name: 'from',
					type: 'address'
				},
				{
					name: 'to',
					type: 'address'
				},
				{
					name: 'tokens',
					type: 'uint256'
				}
			]
		};
		const input = [address, to, value];
		const command = this.generateTxString(abi, input);
		// sending out transaction
		gasPrice = (await this.getGasPrice()) || gasPrice;
		// gasPrice = gasPrice || await web3.eth.
		this.web3.eth
			.sendSignedTransaction(
				'0x' +
					this.signTx(
						this.createTxCommand(nonce, gasPrice, gasLimit, tokenAddress, 0, command),
						privateKey
					)
			)
			.then(receipt => console.log(receipt))
			.catch(error => console.log(error));
	}

	public getCurrentBlock() {
		return this.web3.eth.getBlockNumber();
	}

	public async getCurrentAddress(): Promise<string> {
		const accounts = await this.web3.eth.getAccounts();
		return accounts[this.accountIndex] || CST.DUMMY_ADDR;
	}

	public getCurrentNetwork(): Promise<number> {
		return this.web3.eth.net.getId();
	}

	public async getEthBalance(address: string): Promise<number> {
		return this.fromWei(await this.web3.eth.getBalance(address));
	}

	public fromWei(value: string | number) {
		return Number(this.web3.utils.fromWei(value, 'ether'));
	}

	public toWei(value: string | number) {
		return this.web3.utils.toWei(value + '', 'ether');
	}

	public checkAddress(addr: string) {
		if (!addr.startsWith('0x') || addr.length !== 42) return false;
		return this.web3.utils.checkAddressChecksum(this.web3.utils.toChecksumAddress(addr));
	}

	public getTransactionReceipt(txHash: string) {
		return this.web3.eth.getTransactionReceipt(txHash);
	}

	public static parseEvent(eventLog: EventLog, timestamp: number): IEvent {
		const returnValue = eventLog.returnValues;
		const output: IEvent = {
			contractAddress: eventLog.address,
			type: eventLog.event,
			id: (eventLog as any)['id'],
			blockHash: eventLog.blockHash,
			blockNumber: eventLog.blockNumber,
			transactionHash: eventLog.transactionHash,
			logStatus: (eventLog as any)['type'],
			parameters: {},
			timestamp: timestamp
		};
		for (const key in returnValue) output.parameters[key] = returnValue[key];

		return output;
	}

	public static async pullEvents(
		contract: Contract,
		start: number,
		end: number,
		event: string
	): Promise<EventLog[]> {
		return contract.getPastEvents(event, {
			fromBlock: start,
			toBlock: end
		});
	}
}