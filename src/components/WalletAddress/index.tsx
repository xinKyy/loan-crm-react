import React from 'react';

const WalletAddress = ({ address, pre = 'address' }) => {
  if (!address) return null;
  const currentAddress = address;
  if (address.length > 25) {
    address =
      address.substring(0, 10) +
      '...' +
      address.substring(address.length - 7, address.length);
  }
  return (
    <a
      target={'_blank'}
      href={`https://bscscan.com/${pre}=${currentAddress}`}
      rel="noreferrer"
    >
      {address}
    </a>
  );
};
export default WalletAddress;
