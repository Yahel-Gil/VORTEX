import { useSelector } from "react-redux";
import { CoinPriceModel } from "../../../Models/CoinPriceModel";
import "./CoinReplacementDialog.css";
import { AppState } from "../../../Redux/AppState";
import { watchlistService } from "../../../Services/WatchlistService";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";

type CoinReplacementDialogProps = {
    isOpen: boolean;               
    pendingCoin: CoinPriceModel | null; 
    onClose: () => void;
};

export function CoinReplacementDialog(props: CoinReplacementDialogProps) {

    // Get current 5 coins from Redux state:
    const watchlist = useSelector((state: AppState) => state.watchlist);

    // Logic to swap the old coin with the new pending coin:
    function handleReplace(oldCoin: CoinPriceModel) {
        
        // 1. Remove the existing coin selected by the user:
        watchlistService.toggleWatchlist(oldCoin);

        // 2. Add the new coin that was waiting:
        if(props.pendingCoin) {
            watchlistService.toggleWatchlist(props.pendingCoin);
        }

        // 3. Close the dialog:
        props.onClose();
    }

    return (
        <Dialog open={props.isOpen} onClose={props.onClose} fullWidth maxWidth="xs">
            
            {/* Dialog Header */}
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                Maximum Limit Reached
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Select a coin to replace with <b>{props.pendingCoin?.name}</b>:
                </Typography>
            </DialogTitle>

            {/* List of current coins to choose for replacement */}
            <DialogContent dividers>
                <List>
                    {watchlist.map(coin => (
                        <ListItem 
                            key={coin.id} 
                            disablePadding
                            sx={{ mb: 1, border: "1px solid #eee", borderRadius: "8px" }}
                        >
                            {/* Clickable row triggers the replacement logic */}
                            <ListItemButton onClick={() => handleReplace(coin)}>
                                <ListItemAvatar>
                                    <Avatar src={coin.image} alt={coin.name} />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={coin.name} 
                                    secondary={coin.symbol?.toUpperCase()} 
                                />
                                <Typography variant="caption" color="primary" sx={{ fontWeight: "bold" }}>
                                    REPLACE
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>

            {/* Actions section with Cancel button */}
            <DialogActions sx={{ justifyContent: "center", p: 2 }}>
                <Button onClick={props.onClose} color="inherit" variant="outlined">
                    Cancel
                </Button>
            </DialogActions>

        </Dialog>
    );
}