import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { aiAdviceSlice } from "../../../Redux/AiAdvicesSlice";
import { analystService } from "../../../Services/AnalystService";
import { watchlistService } from "../../../Services/WatchlistService";
import { CircularProgress } from "@mui/material";
import { notify } from "../../../Utils/Notify";
import "./Recommendations.css";

export function Recommendations() {

    const dispatch = useDispatch();

    // Redux selectors for global state:
    const watchlist = useSelector((state: AppState) => state.watchlist || []);
    const aiAdvices = useSelector((state: AppState) => state.aiAdvices || {});

    // Local state for individual loading indicators:
    const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});

    // Sync watchlist from storage on mount:
    useEffect(() => {
        watchlistService.getAllWatchlist();
    }, []);

    // Determine CSS class based on AI response keywords:
    const getRecommendationClass = (text: string) => {
        if (!text) return "";
        const firstLine = text.split('\n')[0].toUpperCase();
        if (firstLine.includes("DON'T BUY")) return "status-sell";
        if (firstLine.includes("BUY")) return "status-buy";
        return "";
    };

    // Main logic for fetching analysis and AI advice:
    const handleAnalyze = async (coinId: string) => {
        try {
            // Set loading for this specific coin:
            setLoadingMap(prev => ({ ...prev, [coinId]: true }));

            // 1. Get technical data:
            const coinData = await analystService.getCoinAnalysis(coinId);
            
            // 2. Send data to AI for advice:
            const aiResponse = await analystService.getAIAdvice(coinData);

            // 3. Update Redux store with new advice:
            dispatch(aiAdviceSlice.actions.updateSingleAdvice({ coinId, advice: aiResponse }));

        } catch (err: any) {
            notify.error(err);
        } finally {
            // Remove loading state:
            setLoadingMap(prev => ({ ...prev, [coinId]: false }));
        }
    };

    return (
        <div className="Recommendations-page">
            
            <header className="page-header">
                <h1>AI Market Analyst</h1>
                <p>Expert insights for your active watchlist</p>
                <div className="header-underline"></div>
            </header>

            <main className="analysis-container">
                <div className="analysis-flex-wrapper">

                    {/* Check if watchlist is empty: */}
                    {watchlist.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Assets Selected</h3>
                            <p>Add coins from the home page to start analysis.</p>
                        </div>
                    ) : (
                        // Map through coins to build cards:
                        watchlist.map(coin => {
                            const advice = aiAdvices[coin.id!] || "";
                            const statusClass = getRecommendationClass(advice);

                            return (
                                <div key={coin.id} className={`analysis-card ${statusClass}`}>
                                    
                                    <div className="card-top">
                                        <div className="advice-coin-meta">
                                            <span className="advice-coin-name">{coin.name}</span>
                                            <span className="advice-coin-symbol">{coin.symbol}</span>
                                        </div>
                                        {/* Display badge only if advice exists: */}
                                        {statusClass && (
                                            <div className="status-badge">
                                                {statusClass === 'status-buy' ? 'Worth Buying' : 'Not Recommended'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-body">
                                        {/* Show advice text or placeholder: */}
                                        {advice ? (
                                            <p className="advice-text">
                                                {/* Strip "EXPLANATION:" prefix if present: */}
                                                {advice.includes("EXPLANATION:") ? advice.split("EXPLANATION:")[1].trim() : advice}
                                            </p>
                                        ) : (
                                            <div className="empty-card-visual">
                                                <div className="coin-placeholder-icon">
                                                    {coin.image ? <img src={coin.image} alt={coin.name} /> : coin.symbol?.charAt(0)}
                                                </div>
                                                <p>Analyze {coin.name}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer">
                                        <button 
                                            className="analyze-btn"
                                            onClick={() => handleAnalyze(coin.id!)}
                                            disabled={loadingMap[coin.id!]}
                                        >
                                            {/* Toggle between spinner and text based on loading state: */}
                                            {loadingMap[coin.id!] ? (
                                                <CircularProgress size={22} color="inherit" />
                                            ) : (
                                                advice ? "Re-Analyze" : "Generate Advice"
                                            )}
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}