import { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,

} from '@solana/wallet-adapter-react-ui';
import {
    NightlyWalletAdapter,
    SolflareWalletAdapter
} from "@solana/wallet-adapter-wallets";

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export const Wallet = ({ children }: { children: ReactNode }) => {
    // You can also provide a custom RPC endpoint.
    const endpoint = "https://api.testnet.sonic.game"

    const wallets = useMemo(
        () => [new NightlyWalletAdapter(), new SolflareWalletAdapter()],
        []
    );
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};