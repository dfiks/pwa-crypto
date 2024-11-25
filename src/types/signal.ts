export interface TopHolder {
  value: number;
  address: string;
}

export interface LastSignal {
  pair: string;
  price: number;
  address: string;
  fdv: string;
  liquidity: string;
  volume: string;
  age: string;
  ath: string;
  athTime: string;
  hourChange: string;
  hourVolume: string;
  buyers: number;
  sellers: number;
  topHolders: TopHolder[];
}

export interface QuickTransfer {
  id: number;
  name: string;
  avatar: string;
}

export interface Transaction {
  id: number;
  type: 'Buy' | 'Sell' | 'Deposit';
  coin: string;
  amount: number;
  isPositive: boolean;
  icon: any; // Using any for Heroicon component type
}