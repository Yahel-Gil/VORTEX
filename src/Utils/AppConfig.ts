class AppConfig {
    public readonly coinsListUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    public readonly coinInfoUrl = "https://api.coingecko.com/api/v3/coins/";
    public readonly coinsReportUrl = "https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms=";
    public readonly coinAnalysisUrl = "https://api.coingecko.com/api/v3/coins/";
    public readonly chatGptUrl = "https://api.openai.com/v1/chat/completion";
	public readonly openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
}

export const appConfig = new AppConfig();
