import { useState } from "react";
import { Card, CardContent, Button, Typography, Switch, CircularProgress, Box, Divider, Collapse } from "@mui/material";
import { useSelector } from "react-redux";
import { CoinPriceModel } from "../../../Models/CoinPriceModel";
import { CoinExtendedInfoModel } from "../../../Models/CoinExtendedInfoModel";
import { coinService } from "../../../Services/CoinService";
import { AppState } from "../../../Redux/AppState";
import { notify } from "../../../Utils/Notify";
import "./CoinCard.css";

interface CoinCardProps {
    coin: CoinPriceModel;
    onToggle: () => void; 
}

export function CoinCard(props: CoinCardProps) {

    // Track info section state:
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
    // Store coin details:
    const [details, setDetails] = useState<CoinExtendedInfoModel | null>(null);
    // Track loading state:
    const [loading, setLoading] = useState<boolean>(false);

    // Check if coin is in watchlist:
    const isWatched = useSelector((state: AppState) => 
        state.watchlist.some(c => c.id === props.coin.id)
    );

    // Toggle watchlist state:
    function handleWatchlistChange() {
        props.onToggle();
    }

    // Toggle info section and fetch data:
    async function handleToggleInfo() {
        setIsInfoOpen(!isInfoOpen);
        
        if (!isInfoOpen && !details) {
            setLoading(true);
            try {
                // Fetch details from service:
                const data = await coinService.getCoinDetails(props.coin.id!);
                setDetails(data);
            } catch (err: any) {
                // Handle fetch error:
                notify.error(err);
            } finally {
                // Stop loading spinner:
                setLoading(false);
            }
        }
    }

    return (
        <Card className="coin-card-mui">
            <CardContent className="card-container">
                
                {/* Card header with toggle and symbol: */}
                <Box className="card-header">
                    <Switch 
                        color="primary" 
                        size="small" 
                        checked={isWatched} 
                        onChange={handleWatchlistChange}
                    />
                    <Typography variant="h6" className="coin-symbol">
                        {props.coin.symbol?.toUpperCase()}
                    </Typography>
                </Box>

                <Divider />

                <Box className="content-wrapper">
                    
                    {/* Main coin view: */}
                    <Collapse in={!isInfoOpen} timeout={500} className="view-collapse">
                        <Box className="main-view">
                            <img src={props.coin.image} alt={props.coin.name} className="coin-image" />
                            <Typography variant="body1" className="coin-name">
                                {props.coin.name}
                            </Typography>
                        </Box>
                    </Collapse>

                    {/* Detailed info view: */}
                    <Collapse in={isInfoOpen} timeout={500} className="view-collapse">
                        <Box className="overlay-content">
                            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 2 }}>
                                LIVE MARKET RATES
                            </Typography>
                            
                            {/* Show loading or prices: */}
                            {loading ? (
                                <CircularProgress size={30} thickness={5} />
                            ) : details && (
                                <Box className="prices-list">
                                    <div className="price-row">
                                        <span className="symbol">$</span>
                                        <span className="val">{details.market_data?.current_price?.usd?.toLocaleString()}</span>
                                    </div>
                                    <div className="price-row">
                                        <span className="symbol">€</span>
                                        <span className="val">{details.market_data?.current_price?.eur?.toLocaleString()}</span>
                                    </div>
                                    <div className="price-row">
                                        <span className="symbol">₪</span>
                                        <span className="val">{details.market_data?.current_price?.ils?.toLocaleString()}</span>
                                    </div>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </Box>

                {/* Action button: */}
                <Button 
                    variant={isInfoOpen ? "outlined" : "contained"} 
                    fullWidth 
                    onClick={handleToggleInfo}
                    className="toggle-button"
                >
                    {isInfoOpen ? "BACK" : "MORE INFO"}
                </Button>

            </CardContent>
        </Card>
    );
}