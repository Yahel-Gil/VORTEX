export class CoinAnalysisModel {
    [x: string]: any;
    public id?: string;
    public name?: string;
    public current_price_usd?: number;
    public market_cap_usd?: number;
    public volume_24h_usd?: number;
    public price_change_percentage_30d_in_currency?: number;
    public price_change_percentage_60d_in_currency?: number;
    public price_change_percentage_200d_in_currency?: number;
}
