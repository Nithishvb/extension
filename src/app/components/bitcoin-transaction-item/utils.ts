import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

type ColorsStringLiteral =
  | 'accent'
  | 'brand'
  | 'bg'
  | 'bg-2'
  | 'bg-3'
  | 'bg-4'
  | 'bg-alt'
  | 'bg-light'
  | 'invert'
  | 'text-hover'
  | 'text-title'
  | 'text-caption'
  | 'text-body'
  | 'icon'
  | 'input-placeholder'
  | 'border'
  | 'feedback-alert'
  | 'feedback-error'
  | 'feedback-success';

type BtcTxStatus = 'pending' | 'success';
type BtcStatusColorMap = Record<BtcTxStatus, ColorsStringLiteral>;

const statusFromTx = (tx: BitcoinTx): BtcTxStatus => {
  if (tx.status.confirmed) return 'success';
  return 'pending';
};
// #4164 FIXME migrate to new colors
export const colorFromTx = (tx: BitcoinTx): ColorsStringLiteral => {
  const colorMap: BtcStatusColorMap = {
    pending: 'feedback-alert',
    success: 'brand',
  };

  return colorMap[statusFromTx(tx)] ?? 'feedback-error';
};

export function containsTaprootInput(tx: BitcoinTx) {
  return tx.vin.some(input => input.prevout.scriptpubkey_type === 'v1_p2tr');
}
