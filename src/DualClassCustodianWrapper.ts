import BaseContractWrapper from './BaseContractWrapper';
import * as CST from './constants';
import dualClassCustodianAbi from './static/DualClassCustodian.json';
import { IBeethovenStates, ICustodianAddresses } from './types';
import util from './util';
import Web3Wrapper from './Web3Wrapper';

export default class DualClassCustodianWapper extends BaseContractWrapper {
	public readonly events = [
		CST.EVENT_UPDATE_ROLE_MANAGER,
		CST.EVENT_UPDATE_OPERATOR,
		CST.EVENT_START_TRADING,
		CST.EVENT_START_PRE_RESET,
		CST.EVENT_START_RESET,
		CST.EVENT_MATURED,
		CST.EVENT_ACCEPT_PRICE,
		CST.EVENT_CREATE,
		CST.EVENT_REDEEM,
		CST.EVENT_TOTAL_SUPPLY,
		CST.EVENT_TRANSFER,
		CST.EVENT_APPROVAL,
		CST.EVENT_COLLECT_FEE,
		CST.EVENT_UPDATE_ORACLE,
		CST.EVENT_UPDATE_FEE_COLLECTOR,
		CST.EVENT_SET_VALUE
	];
	constructor(web3Wrapper: Web3Wrapper, address: string) {
		super(web3Wrapper, dualClassCustodianAbi.abi, address);
	}

	public async startCustodianRaw(
		address: string,
		privateKey: string,
		aAddr: string,
		bAddr: string,
		oracleAddr: string,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		util.logInfo(`the account ${address} is starting custodian`);
		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		const abi = {
			name: 'startCustodian',
			type: 'function',
			inputs: [
				{
					name: 'aAddr',
					type: 'address'
				},
				{
					name: 'bAddr',
					type: 'address'
				},
				{
					name: 'oracleAddr',
					type: 'address'
				}
			]
		};
		const input = [aAddr, bAddr, oracleAddr];

		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		await this.sendTransactionRaw(
			address,
			privateKey,
			this.address,
			0,
			gasPrice,
			gasLimit,
			nonce,
			command
		);
	}

	public async fetchPriceRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		util.logInfo(`the account ${address} is fetching price`);
		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		const abi = {
			type: 'function',
			inputs: [],
			name: 'fetchPrice'
		};

		const command = this.web3Wrapper.generateTxString(abi, []);
		await this.sendTransactionRaw(
			address,
			privateKey,
			this.address,
			0,
			gasPrice,
			gasLimit,
			nonce,
			command
		);
	}

	public async createRaw(
		address: string,
		privateKey: string,
		gasPrice: number,
		gasLimit: number,
		eth: number,
		nonce: number = -1
	) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();

		util.logInfo(`the account ${address} is creating tokens`);
		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		const abi = {
			name: 'create',
			type: 'function',
			inputs: [
				{
					name: 'payFeeInEth',
					type: 'bool'
				}
			]
		};
		const input = [true];
		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		gasPrice = (await this.web3Wrapper.getGasPrice()) || gasPrice;
		util.logInfo(
			`gasPrice price :${gasPrice} gasLimit : ${gasLimit} nonce : ${nonce} eth : ${eth}`
		);
		return this.sendTransactionRaw(
			address,
			privateKey,
			this.address,
			eth,
			gasPrice,
			gasLimit,
			nonce,
			command
		);
	}

	public create(address: string, value: number, onTxHash: (hash: string) => any) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods
			.create()
			.send({
				from: address,
				value: this.web3Wrapper.toWei(value)
			})
			.on('transactionHash', onTxHash);
	}

	public async redeemRaw(
		address: string,
		privateKey: string,
		amtA: number,
		amtB: number,
		gasPrice: number,
		gasLimit: number,
		nonce: number = -1
	) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();

		util.logInfo('the account ' + address + ' privateKey is ' + privateKey);
		nonce = nonce === -1 ? await this.web3Wrapper.getTransactionCount(address) : nonce;
		const balanceOfA = await this.contract.methods.balanceOf(0, address).call();
		const balanceOfB = await this.contract.methods.balanceOf(1, address).call();
		util.logInfo('current balanceA: ' + balanceOfA + ' current balanceB: ' + balanceOfB);
		const abi = {
			name: 'redeem',
			type: 'function',
			inputs: [
				{
					name: 'amtInWeiA',
					type: 'uint256'
				},
				{
					name: 'amtInWeiB',
					type: 'uint256'
				},
				{
					name: 'payFeeInEth',
					type: 'bool'
				}
			]
		};
		const input = [amtA, amtB, true];
		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		util.logInfo(
			`gasPrice price :${gasPrice} gasLimit : ${gasLimit} nonce : ${nonce} amtA : ${amtA} amtB : ${amtB}`
		);
		return this.sendTransactionRaw(
			address,
			privateKey,
			this.address,
			0,
			gasPrice,
			gasLimit,
			nonce,
			command
		);
	}

	public redeem(address: string, amtA: number, amtB: number, onTxHash: (hash: string) => any) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods
			.redeem(this.web3Wrapper.toWei(amtA), this.web3Wrapper.toWei(amtB))
			.send({
				from: address
			})
			.on('transactionHash', onTxHash);
	}

	public redeemAll(address: string, onTxHash: (hash: string) => any) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();

		return this.contract.methods
			.redeemAll()
			.send({
				from: address
			})
			.on('transactionHash', onTxHash);
	}

	private async trigger(
		address: string,
		privateKey: string,
		abi: object,
		input: any[],
		gasPrice: number,
		gasLimit: number
	) {
		const nonce = await this.web3Wrapper.getTransactionCount(address);
		const command = this.web3Wrapper.generateTxString(abi, input);
		// sending out transaction
		this.sendTransactionRaw(
			address,
			privateKey,
			this.address,
			0,
			gasPrice,
			gasLimit,
			nonce,
			command
		);
	}

	public async triggerReset(address: string, privateKey: string, count: number = 1) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();

		const abi = {
			name: 'startReset',
			type: 'function',
			inputs: []
		};
		const gasPrice = (await this.web3Wrapper.getGasPrice()) || CST.DEFAULT_GAS_PRICE;
		util.logInfo('gasPrice price ' + gasPrice + ' gasLimit is ' + CST.RESET_GAS_LIMIT);
		const promiseList: Array<Promise<void>> = [];
		for (let i = 0; i < count; i++)
			promiseList.push(
				this.trigger(address, privateKey, abi, [], gasPrice, CST.RESET_GAS_LIMIT)
			);

		return Promise.all(promiseList);
	}

	public async triggerPreReset(address: string, privateKey: string) {
		if (!this.web3Wrapper.isLocal()) return this.web3Wrapper.wrongEnvReject();

		const abi = {
			name: 'startPreReset',
			type: 'function',
			inputs: []
		};
		const gasPrice = (await this.web3Wrapper.getGasPrice()) || CST.DEFAULT_GAS_PRICE;
		util.logInfo('gasPrice price ' + gasPrice + ' gasLimit is ' + CST.PRE_RESET_GAS_LIMIT);
		return this.trigger(address, privateKey, abi, [], gasPrice, CST.PRE_RESET_GAS_LIMIT); // 120000 for lastOne; 30000 for else
	}

	public static convertCustodianState(rawState: string) {
		switch (rawState) {
			case CST.STATE_INCEPTION:
				return CST.CTD_INCEPTION;
			case CST.STATE_TRADING:
				return CST.CTD_TRADING;
			case CST.STATE_PRERESET:
				return CST.CTD_PRERESET;
			case CST.STATE_RESET:
				return CST.CTD_RESET;
			case CST.STATE_MATURED:
				return CST.CTD_MATURED;
			default:
				return CST.CTD_LOADING;
		}
	}

	public static convertResetState(rawState: string) {
		switch (rawState) {
			case CST.RESET_STATE_UP:
				return CST.BTV_UP_RESET;
			case CST.RESET_STATE_DOWN:
				return CST.BTV_DOWN_RESET;
			case CST.RESET_STATE_PERIOD:
				return CST.BTV_PERIOD_RESET;
			default:
				return '';
		}
	}

	public async getStates(): Promise<IBeethovenStates> {
		const states = await this.contract.methods.getStates().call();
		return {
			lastOperationTime: Number(states[CST.BTV_STATE.LAST_OPERATION_TIME].valueOf()) * 1000,
			operationCoolDown: Number(states[CST.BTV_STATE.OPERATION_COOLDOWN].valueOf()) * 1000,
			state: DualClassCustodianWapper.convertCustodianState(states[CST.BTV_STATE.STATE].valueOf()),
			minBalance: this.web3Wrapper.fromWei(states[CST.BTV_STATE.MIN_BALANCE]),
			totalSupplyA: this.web3Wrapper.fromWei(states[CST.BTV_STATE.TOTAL_SUPPLYA]),
			totalSupplyB: this.web3Wrapper.fromWei(states[CST.BTV_STATE.TOTAL_SUPPLYB]),
			ethCollateral: this.web3Wrapper.fromWei(states[CST.BTV_STATE.ETH_COLLATERAL_INWEI]),
			navA: this.web3Wrapper.fromWei(states[CST.BTV_STATE.NAVA_INWEI]),
			navB: this.web3Wrapper.fromWei(states[CST.BTV_STATE.NAVB_INWEI]),
			lastPrice: this.web3Wrapper.fromWei(states[CST.BTV_STATE.LAST_PRICE_INWEI]),
			lastPriceTime: Number(states[CST.BTV_STATE.LAST_PRICETIME_INSECOND].valueOf()) * 1000,
			resetPrice: this.web3Wrapper.fromWei(states[CST.BTV_STATE.RESET_PRICE_INWEI]),
			resetPriceTime: Number(states[CST.BTV_STATE.RESET_PRICETIME_INSECOND].valueOf()) * 1000,
			createCommRate: Number(states[CST.BTV_STATE.CREATE_COMMINBP].valueOf()) / 10000,
			redeemCommRate: Number(states[CST.BTV_STATE.REDEEM_COMMINBP].valueOf()) / 10000,
			period: Number(states[CST.BTV_STATE.PERIOD].valueOf()) * 1000,
			maturity: Number(states[CST.BTV_STATE.MATURITY].valueOf()) * 1000,
			preResetWaitingBlocks: Number(states[CST.BTV_STATE.PRERESET_WAITING_BLOCKS].valueOf()),
			priceFetchCoolDown: Number(states[CST.BTV_STATE.PRICE_FETCH_COOLDOWN].valueOf()) * 1000,
			nextResetAddrIndex: Number(states[CST.BTV_STATE.NEXT_RESET_ADDR_INDEX].valueOf()),
			totalUsers: Number(states[CST.BTV_STATE.TOTAL_USERS].valueOf()),
			feeBalance: this.web3Wrapper.fromWei(states[CST.BTV_STATE.FEE_BALANCE_INWEI]),
			resetState: DualClassCustodianWapper.convertResetState(
				states[CST.BTV_STATE.RESET_STATE].valueOf()
			),
			alpha: Number(states[CST.BTV_STATE.ALPHA_INBP].valueOf()) / 10000,
			beta: this.web3Wrapper.fromWei(states[CST.BTV_STATE.BETA_INWEI]),
			periodCoupon: this.web3Wrapper.fromWei(states[CST.BTV_STATE.PERIOD_COUPON_INWEI]),
			limitPeriodic: this.web3Wrapper.fromWei(states[CST.BTV_STATE.LIMIT_PERIODIC_INWEI]),
			limitUpper: this.web3Wrapper.fromWei(states[CST.BTV_STATE.LIMIT_UPPER_INWEI]),
			limitLower: this.web3Wrapper.fromWei(states[CST.BTV_STATE.LIMIT_LOWER_INWEI]),
			iterationGasThreshold: Number(states[CST.BTV_STATE.ITERATION_GAS_THRESHOLD].valueOf())
		};
	}

	public async getAddresses(): Promise<ICustodianAddresses> {
		const addr: string[] = await this.contract.methods.getAddresses().call();
		return {
			roleManager: addr[0],
			operator: addr[1],
			feeCollector: addr[2],
			oracle: addr[3],
			aToken: addr[4],
			bToken: addr[4]
		};
	}

	public getUserAddress(index: number) {
		return this.contract.methods.users(index).call();
	}

	public collectFee(address: string, amount: number) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.collectFee(this.web3Wrapper.toWei(amount)).send({
			from: address
		});
	}

	public setValue(address: string, index: number, newValue: number) {
		if (this.web3Wrapper.isReadOnly()) return this.web3Wrapper.readOnlyReject();
		return this.contract.methods.setValue(index, newValue).send({
			from: address
		});
	}
}
