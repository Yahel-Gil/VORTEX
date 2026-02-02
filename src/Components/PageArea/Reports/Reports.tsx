import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { reportActions } from "../../../Redux/ReportsSlice";
import { reportService } from "../../../Services/ReportService";
import { watchlistService } from "../../../Services/WatchlistService"; 
import Chart from "react-apexcharts";
import "./Reports.css";
import { notify } from "../../../Utils/Notify";

export function Reports() {
    const dispatch = useDispatch();
    
    // Select data from global state:
    const watchlist = useSelector((state: AppState) => state.watchlist);
    const { marketHistory, timestamps } = useSelector((state: AppState) => state.reports);

    // Setup live data polling on component mount:
    useEffect(() => {
        const coins = watchlistService.getAllWatchlist();
        if (coins.length === 0) return;

        //Flag to prevent notification flooding if the API fails repeatedly within the interval
        let hasError = false;

        // Interval to fetch fresh prices every second:
        const intervalId = setInterval(async () => {
            try {
                const data = await reportService.getPrices(coins);
                const currentTime = new Date().toLocaleTimeString([], { 
                    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
                });

                // Map raw API data to a structured symbol-price object:
                const pricesMap: { [sym: string]: number } = {};
                coins.forEach(c => {
                    const sym = c.symbol!.toUpperCase();
                    pricesMap[sym] = data[sym]?.USD || 0;
                });

                // Update Redux state with the new snapshot:
                dispatch(reportActions.addSnapshot({ prices: pricesMap, time: currentTime }));
            } catch (err) {
                if (!hasError) {
                    notify.error("Connection lost. Retrying...");
                    hasError = true; // Block further notifications
                }
                console.error(err)
                
            }
        }, 1000);

        // Cleanup: Clear the interval when user leaves the page:
        return () => clearInterval(intervalId);
    }, [dispatch]);

    // Data Series - Prepare the last 20 data points for each coin:
    const chartSeries = watchlist.map(coin => ({
        name: coin.symbol!.toUpperCase(),
        data: (marketHistory[coin.symbol!.toUpperCase()] || []).slice(-20)
    }));

    // Chart Configuration - ApexCharts Options:
    const chartOptions: any = {
        chart: { 
            animations: { enabled: false }, // Disabled for smoother live updates
            toolbar: { show: false }, 
            background: 'transparent',
            sparkline: { enabled: false }
        },
        dataLabels: { enabled: false }, 
        stroke: { curve: 'smooth', width: 2 }, 
        colors: ['#00f2ff', '#a29bfe', '#00ff88', '#ff7675', '#fdcb6e'],
        xaxis: { 
            categories: timestamps.slice(-20), 
            tickAmount: 4, 
            labels: { 
                show: true,
                style: { colors: 'rgba(255,255,255,0.6)', fontWeight: 'bold', fontSize: '11px' }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { 
            labels: { 
                style: { colors: 'rgba(255,255,255,0.5)' },
                formatter: (val: number) => `$${val.toLocaleString()}`
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            labels: { colors: '#ffffff' },
            itemMargin: { horizontal: 20, vertical: 10 }
        },
        grid: { 
            borderColor: 'rgba(255,255,255,0.05)',
            padding: { left: 20, right: 20 } 
        },
        tooltip: { theme: 'dark', shared: true }
    };

    return (
        <div className="reports-page">
            <header className="reports-header">
                <h1>Market Intelligence</h1>
                <div className="header-underline"></div>
            </header>

            <main className="reports-main-content">
                {/* Conditional Rendering: Show chart only if coins are tracked */}
                {watchlist.length > 0 ? (
                    <div className="main-report-card">
                        
                        {/* Live Price Dashboard: Dynamic price updates */}
                        <div className="live-values-container">
                            {watchlist.map(coin => {
                                const sym = coin.symbol!.toUpperCase();
                                const history = marketHistory[sym] || [];
                                const lastPrice = history.length > 0 ? history[history.length - 1] : 0;
                                return (
                                    <div key={sym} className="value-box">
                                        <span className="box-sym">{sym}</span>
                                        <span className="box-price">
                                            ${lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ApexCharts Component */}
                        <Chart 
                            options={chartOptions} 
                            series={chartSeries} 
                            type="line" 
                            height="400" 
                        />
                    </div>
                ) : (
                    /* Empty State: Prompt user to add coins */
                    <div className="empty-state">
                        <h3>No coins selected.</h3>
                        <p>Add coins to start tracking live market data.</p>
                    </div>
                )}
            </main>
        </div>
    );
}