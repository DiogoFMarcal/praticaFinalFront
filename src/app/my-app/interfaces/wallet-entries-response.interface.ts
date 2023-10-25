export interface WalletEntry {
    coin: Coin;
    quantity: number;
}

export interface Coin {
    id: number;
    name: string;
    quoteForEuro: number;
}