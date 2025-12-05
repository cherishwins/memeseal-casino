import { Wallet, WalletInfoWithOpenMethod } from '@tonconnect/ui';
/**
 * Use it to get user's current ton wallet. If wallet is not connected hook will return null.
 */
export declare function useTonWallet(): Wallet | (Wallet & WalletInfoWithOpenMethod) | null;
