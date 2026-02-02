export class CoinExtendedInfoModel {
    id?: string;
	image?: {
        small: string;
    };
    market_data?: {
        current_price: {
            usd: number;
            eur: number;
            ils: number;
        };
    };
}
