// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';

import * as CST from './constants';
import DualClassWrapper from './DualClassWrapper';

test('convertCustodianState', () => {
	expect(DualClassWrapper.convertCustodianState(CST.STATE_INCEPTION)).toBe(CST.CTD_INCEPTION);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_PRERESET)).toBe(CST.CTD_PRERESET);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_RESET)).toBe(CST.CTD_RESET);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_TRADING)).toBe(CST.CTD_TRADING);
	expect(DualClassWrapper.convertCustodianState(CST.STATE_MATURED)).toBe(CST.CTD_MATURED);
	expect(DualClassWrapper.convertCustodianState('any')).toBe(CST.CTD_LOADING);
});

test('convertCustodianState', () => {
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_DOWN)).toBe(CST.BTV_DOWN_RESET);
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_UP)).toBe(CST.BTV_UP_RESET);
	expect(DualClassWrapper.convertResetState(CST.RESET_STATE_PERIOD)).toBe(CST.BTV_PERIOD_RESET);
	expect(DualClassWrapper.convertResetState('any')).toBe('');
});

test('getTokensPerEth', () => {
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 1
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 0.8,
			alpha: 1
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 0.5
		} as any)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokensPerEth({
			resetPrice: 100,
			beta: 1,
			alpha: 2
		} as any)
	).toMatchSnapshot();
});

test('getEthWithTokens', () => {
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 1
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 1
			} as any,
			100,
			200
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 0.8,
				alpha: 1
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 0.5
			} as any,
			100,
			100
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getEthWithTokens(
			{
				resetPrice: 100,
				beta: 1,
				alpha: 0.5
			} as any,
			100,
			200
		)
	).toMatchSnapshot();
});

test('getTokenInterestOrLeverage', () => {
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				periodCoupon: 0.0001,
				period: 0
			} as any,
			true,
			true
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				periodCoupon: 0.0001,
				period: 3600000
			} as any,
			true,
			true
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				alpha: 1,
				navB: 1.5
			} as any,
			true,
			false
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				navA: 1.2
			} as any,
			false,
			true
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.getTokenInterestOrLeverage(
			{
				alpha: 0.5,
				navB: 1.5
			} as any,
			false,
			false
		)
	).toMatchSnapshot();
});

test('calculateNav beethoven', () => {
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			300,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			40,
			10
		)
	).toMatchSnapshot();

	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			40,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			true,
			20,
			10
		)
	).toMatchSnapshot();
});

test('calculateNav mozart', () => {
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			300,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 1,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			40,
			10
		)
	).toMatchSnapshot();

	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 2,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			40,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			120,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			80,
			10
		)
	).toMatchSnapshot();
	expect(
		DualClassWrapper.calculateNav(
			{
				resetPrice: 100,
				resetPriceTime: 0,
				alpha: 0.5,
				beta: 1,
				period: 5,
				periodCoupon: 0.000001
			} as any,
			false,
			20,
			10
		)
	).toMatchSnapshot();
});

test('getStates', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						getStates: jest.fn(() => ({
							call: jest.fn(() =>
								Promise.resolve({
									'0': 12345678980,
									'1': 1000000000000000000000,
									'2': 100000000000000000,
									'3': 100000000000000000000000,
									'4': 100000,
									'5': 100,
									'6': 1000000000000000000,
									'7': 2000000000000000000,
									'8': 100000000000000000000,
									'9': 1000000000,
									'10': 100000000000000000000,
									'11': 10000000000000000000000000,
									'12': 1000000000000000000,
									'13': 1000000000000000000,
									'14': 1000000000000000000,
									'15': 1000000000000000000,
									'16': 1000000000000000000,
									'17': 1000000000000000000,
									'18': 1000000000000000000000,
									'19': 10000000000000000000,
									'20': 1000000000000000000000,
									'21': 100000000000000000000,
									'22': 1000000000000000000,
									'23': 1000000000000000000,
									'24': 1000000000000000000,
									'25': 150000000000000,
									'26': 15000000000000000000,
									'27': 2000000000000000000,
									'28': 1000000000000000000,
									'29': 10000
								})
							)
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	expect(await dualClassWrapper.getStates()).toMatchSnapshot();
});

test('getAddress', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						getAddresses: jest.fn(() => ({
							call: jest.fn(() =>
								Promise.resolve({
									'0': 'roleManager',
									'1': 'operator',
									'2': 'feeCollector',
									'3': 'oracle',
									'4': 'aToken',
									'5': 'bToken'
								})
							)
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	expect(await dualClassWrapper.getAddresses()).toMatchSnapshot();
});

test('getUserAddress', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		fromWei: jest.fn(value => value * 1e-18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						users: jest.fn(() => ({
							call: jest.fn(() => Promise.resolve({}))
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.getUserAddress(1);
	expect((dualClassWrapper.contract.methods.users as jest.Mock).mock.calls).toMatchSnapshot();
});

test('collectFee, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						collectFee: jest.fn(() => ({
							send: jest.fn(() => Promise.resolve())
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.collectFee('', 10);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}

	// expect((dualClassWrapper.contract.methods.collectFee as jest.Mock).mock.calls).toMatchSnapshot();
});

test('collectFee, without option', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						collectFee: jest.fn(() => ({
							send: jest.fn(() => Promise.resolve())
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	await dualClassWrapper.collectFee('', 10);

	expect(
		(dualClassWrapper.contract.methods.collectFee as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('collectFee, with option', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						collectFee: jest.fn(() => ({
							send: jest.fn(() => Promise.resolve())
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	await dualClassWrapper.collectFee('', 10, {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});

	expect(
		(dualClassWrapper.contract.methods.collectFee as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('setValue, readOnly', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						setValue: jest.fn(() => ({
							send: jest.fn(() => Promise.resolve())
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.setValue('', 1, 10);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('setValue, without option', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		createContract: jest.fn(
			() =>
				({
					methods: {
						setValue: jest.fn(() => ({
							send: jest.fn(() => Promise.resolve())
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	await dualClassWrapper.setValue('', 1, 10);

	expect((dualClassWrapper.contract.methods.setValue as jest.Mock).mock.calls).toMatchSnapshot();
});

test('setValue, with option', async () => {
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						setValue: jest.fn(() => ({
							send: jest.fn(() => Promise.resolve())
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	await dualClassWrapper.setValue('', 1, 10, {
		gasLimit: 20000,
		gasPrice: 2000000000,
		nonce: 40
	});

	expect((dualClassWrapper.contract.methods.setValue as jest.Mock).mock.calls).toMatchSnapshot();
});

test('create, readOnly', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						create: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.create('', 1, '');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('create, with WETH', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		toWei: jest.fn(value => value * 1e18),
		isReadOnly: jest.fn(() => false),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						createWithWETH: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createWithWETHtxHash'), 0);
								return {
									on: on
								};
							})
						})),
						create: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode'))
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	//
	await dualClassWrapper.create('', 1, 'wethAddr');
	expect(
		(dualClassWrapper.contract.methods.createWithWETH as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('create, with ETH', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		toWei: jest.fn(value => value * 1e18),
		isReadOnly: jest.fn(() => false),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						createWithWETH: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createWithWETHtxHash'), 0);
								return {
									on: on
								};
							})
						})),
						create: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode'))
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.create('', 1, '');
	expect(
		(dualClassWrapper.contract.methods.createWithWETH as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('create, with option', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		toWei: jest.fn(value => value * 1e18),
		isReadOnly: jest.fn(() => false),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						createWithWETH: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createWithWETHtxHash'), 0);
								return {
									on: on
								};
							})
						})),
						create: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode'))
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.create('', 1, '', {
		gasPrice: 1000000000,
		gasLimit: 20000,
		nonce: 10
	});
	expect(
		(dualClassWrapper.contract.methods.createWithWETH as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('redeem, readOnly', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						redeeem: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('redeemTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.redeem('', 1, 1);
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('redeem, without option', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		toWei: jest.fn(value => value * 1e18),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						redeem: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('redeemTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	await dualClassWrapper.redeem('', 1, 1);
	expect((dualClassWrapper.contract.methods.redeem as jest.Mock).mock.calls).toMatchSnapshot();
});

test('redeem, with option', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		toWei: jest.fn(value => value * 1e18),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						redeem: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('redeemTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	await dualClassWrapper.redeem('', 1, 1, {
		gasPrice: 1000000000,
		gasLimit: 20000,
		nonce: 10
	});
	expect((dualClassWrapper.contract.methods.redeem as jest.Mock).mock.calls).toMatchSnapshot();
	expect(
		(dualClassWrapper.contract.methods.redeem().send as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('redeemAll, readOnly', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isReadOnly: jest.fn(() => true),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		toWei: jest.fn(value => value * 1e18),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						redeemAll: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('redeemAllTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.redeemAll('');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('redeemAll, without option', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		toWei: jest.fn(value => value * 1e18),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						redeemAll: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('redeemAllTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.redeemAll('');
	expect((dualClassWrapper.contract.methods.redeemAll as jest.Mock).mock.calls).toMatchSnapshot();
});
test('redeemAll, with option', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isReadOnly: jest.fn(() => false),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		readOnlyReject: jest.fn(() => Promise.reject('Read Only Mode')),
		toWei: jest.fn(value => value * 1e18),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						redeemAll: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('redeemAllTxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.redeemAll('', {
		gasLimit: 20000,
		gasPrice: 100000,
		nonce: 30
	});
	expect((dualClassWrapper.contract.methods.redeemAll as jest.Mock).mock.calls).toMatchSnapshot();
});

test('startCustodian, isLocal wallet', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isLocal: jest.fn(() => false),
		isReadOnly: jest.fn(() => true),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		wrongEnvReject: jest.fn(() => Promise.reject('wrong env')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startCustodian: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createWithWETHtxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.startCustodian('', 'aAddr', 'bAddr', 'oracleAddr');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('startCustodian, without option', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isLocal: jest.fn(() => true),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startCustodian: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createWithWETHtxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.startCustodian('', 'aAddr', 'bAddr', 'oracleAddr');
	expect(
		(dualClassWrapper.contract.methods.startCustodian as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('startCustodian', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isLocal: jest.fn(() => true),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startCustodian: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('createWithWETHtxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.startCustodian('', 'aAddr', 'bAddr', 'oracleAddr', {
		gasPrice: 1000000000,
		gasLimit: 20000,
		nonce: 10
	});
	const startCustodian = dualClassWrapper.contract.methods.startCustodian;
	expect((startCustodian as jest.Mock).mock.calls).toMatchSnapshot();
});

test('fetchPrice, isLocal wallet', async () => {
	const web3Wrapper = {
		isLocal: jest.fn(() => false),
		isReadOnly: jest.fn(() => true),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		wrongEnvReject: jest.fn(() => Promise.reject('wrong env')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						fetchPrice: jest.fn(() => ({
							send: jest.fn()
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.fetchPrice('');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('fetchPrice, without option', async () => {
	const web3Wrapper = {
		isLocal: jest.fn(() => true),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		wrongEnvReject: jest.fn(() => Promise.reject('wrong env')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						fetchPrice: jest.fn(() => ({
							send: jest.fn(() => Promise.resolve({}))
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.fetchPrice('');
	expect(
		(dualClassWrapper.contract.methods.fetchPrice as jest.Mock).mock.calls
	).toMatchSnapshot();
	// send inputs not called, not knowing the reason
	expect(
		(dualClassWrapper.contract.methods.fetchPrice().send as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('fetchPrice,', async () => {
	const web3Wrapper = {
		isLocal: jest.fn(() => true),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getTransactionCount: jest.fn(() => Promise.resolve(2)),
		wrongEnvReject: jest.fn(() => Promise.reject('wrong env')),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						fetchPrice: jest.fn(() => ({
							send: jest.fn(() => Promise.resolve({}))
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	await dualClassWrapper.fetchPrice('', {
		gasPrice: 1000000000,
		gasLimit: 20000,
		nonce: 10
	});
	expect(
		(dualClassWrapper.contract.methods.fetchPrice as jest.Mock).mock.calls
	).toMatchSnapshot();
	// send inputs not called, not knowing the reason
	expect(
		(dualClassWrapper.contract.methods.fetchPrice().send as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('triggerPreReset not local', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isLocal: jest.fn(() => false),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						triggerPreReset: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('triggerPreResettxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.triggerPreReset('');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('triggerPreReset without option', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isLocal: jest.fn(() => true),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startPreReset: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('triggerPreResettxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	await dualClassWrapper.triggerPreReset('');
	expect(
		(dualClassWrapper.contract.methods.startPreReset as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('triggerPreReset with option', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isLocal: jest.fn(() => true),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startPreReset: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('triggerPreResettxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	await dualClassWrapper.triggerPreReset('', {
		gasLimit: 20000,
		gasPrice: 1000000000,
		nonce: 30
	});
	expect(
		(dualClassWrapper.contract.methods.startPreReset as jest.Mock).mock.calls
	).toMatchSnapshot();
});

test('triggerReset not local', async () => {
	const on = jest.fn();
	const web3Wrapper = {
		isLocal: jest.fn(() => false),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startReset: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => on.mock.calls[0][1]('triggerResettxHash'), 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');
	try {
		await dualClassWrapper.triggerReset('');
	} catch (err) {
		expect(err).toMatchSnapshot();
	}
});

test('triggerReset, without option', async () => {
	const on = jest.fn();
	const numOftriggers = 10;
	const web3Wrapper = {
		isLocal: jest.fn(() => true),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startReset: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => {
									for (let i = 0; i < numOftriggers; i++)
										on.mock.calls[i][1]('triggerResettxHash' + i);
								}, 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	const res = await dualClassWrapper.triggerReset('', 10);
	expect(
		(dualClassWrapper.contract.methods.startReset as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(res).toMatchSnapshot();
});

test('triggerReset, with option', async () => {
	const on = jest.fn();
	const numOftriggers = 10;
	const web3Wrapper = {
		isLocal: jest.fn(() => true),
		isReadOnly: jest.fn(() => false),
		toWei: jest.fn(value => value * 1e18),
		onSwitchToMetaMask: jest.fn(() => ({} as any)),
		onSwitchToLedger: jest.fn(() => ({} as any)),
		getGasPrice: jest.fn(() => Promise.resolve(1000000000)),
		getCurrentAddress: jest.fn(() => Promise.resolve('currentAddress')),
		createContract: jest.fn(
			() =>
				({
					methods: {
						startReset: jest.fn(() => ({
							send: jest.fn(() => {
								setTimeout(() => {
									for (let i = 0; i < numOftriggers; i++)
										on.mock.calls[i][1]('triggerResettxHash' + i);
								}, 0);
								return {
									on: on
								};
							})
						}))
					}
				} as any)
		)
	} as any;
	const dualClassWrapper = new DualClassWrapper(web3Wrapper, 'address');

	const res = await dualClassWrapper.triggerReset('', 10, {
		gasLimit: 20000,
		gasPrice: 1000000000,
		nonce: 40
	});
	expect(
		(dualClassWrapper.contract.methods.startReset as jest.Mock).mock.calls
	).toMatchSnapshot();
	expect(res).toMatchSnapshot();
});
