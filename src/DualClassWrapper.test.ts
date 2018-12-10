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