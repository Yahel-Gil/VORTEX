import { ChangeEvent, useEffect, useState } from "react";
import { CoinPriceModel } from "../../../Models/CoinPriceModel";
import { coinService } from "../../../Services/CoinService";
import { watchlistService } from "../../../Services/WatchlistService";
import { CoinCard } from "../../CoinArea/CoinCard/CoinCard";
import { notify } from "../../../Utils/Notify";
import "./Home.css";
import { CoinReplacementDialog } from "../../CoinArea/CoinReplacementDialog/CoinReplacementDialog";
import backgroundPath from "../../../assets/crypto-bg.png";

export function Home() {

    // Local state for coins from server:
    const [coins, setCoins] = useState<CoinPriceModel[]>([]);

    // Local state for search:
    const [filteredCoins, setFilteredCoins] = useState<CoinPriceModel[]>([]);

    // State for the Dialog:
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [pendingCoin, setPendingCoin] = useState<CoinPriceModel | null>(null);

    // Fetch coins and initialize watchlist on mount:
    useEffect(() => {
        // 1. Sync Redux with LocalStorage data:
        watchlistService.getAllWatchlist();

        // 2. Fetch all coins from API:
        coinService.getAllCoins()
            .then(data => {
                setCoins(data);          // Set initial coins
                setFilteredCoins(data);  // Set initial filtered list
            })
            .catch(err => notify.error(err));
    }, []);

    // Function to handle the toggle with logic for 5 coins:
    function handleToggle(coin: CoinPriceModel) {
        const watchlist = watchlistService.getAllWatchlist();
        const exists = watchlist.find(c => c.id === coin.id);

        // If trying to add and already have 5 coins:
        if (!exists && watchlist.length >= 5) {
            setPendingCoin(coin);
            setIsDialogOpen(true);
        } else {
            // Otherwise, just toggle normally:
            watchlistService.toggleWatchlist(coin);
        }
    }

    // Handle search input change:
    const handleSearch = (args: ChangeEvent<HTMLInputElement>): void => {
        const value = args.target.value.toLowerCase();

        // Filter from the current coins list:
        const result = coins.filter(c =>
            c.name?.toLowerCase().includes(value) ||
            c.symbol?.toLowerCase().includes(value)
        );

        setFilteredCoins(result);
    };

    return (
        /* Main parallax wrapper */
        <div className="Home parallax-wrapper">

            {/* Parallax hero section */}
            <div className="parallax-header">
                    <img src={backgroundPath} className="layer layer-back" alt="Crypto Background" />
                <div className="layer layer-base">
                    <h1>VORTEX</h1>
                    <p>Real-time Virtual Currency Tracking</p>
                </div>
                <div className="fade-overlay"></div>
            </div>

            {/* Content area */}
            <main className="main-content">

                <CoinReplacementDialog
                    isOpen={isDialogOpen}
                    pendingCoin={pendingCoin}
                    onClose={() => setIsDialogOpen(false)}
                />

                {/* THE SEARCH: Sticky and sitting right above cards */}
                <div className="search-container">
                    <input
                        type="search"
                        placeholder="Search coins..."
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                <div className="coin-list">
                    {/* 1. Check if there are no coins after filtering: */}
                    {filteredCoins.length === 0 && (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No coins found...</h3>
                            <p>Try searching for a different name or symbol.</p>
                        </div>
                    )}

                    {/* 2. Map the coins only if they exist: */}
                    {filteredCoins.length > 0 &&
                        filteredCoins.map(c => <CoinCard key={c.id} coin={c} onToggle={() => handleToggle(c)} />)
                    }
                </div>

            </main>

        </div>
    );
}