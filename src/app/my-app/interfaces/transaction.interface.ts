export interface Transaction {
    date: Date;
    amountInEuros: number;
    operationType: string;
    sourceCoin: string;
    destinationCoin: string;
}