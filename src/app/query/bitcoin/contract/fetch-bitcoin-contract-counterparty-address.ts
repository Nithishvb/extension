export async function fetchBitcoinContractCounterpartyAddress(counterpartyWalletURL: string) {
  const response = await fetch(`${counterpartyWalletURL}/info`, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch Bitcoin Contract counterparty address.');
  }

  const info = await response.json();

  return info.wallet.address;
}
