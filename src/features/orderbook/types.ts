export type BinanceDepthLevelTuple = [price: string, quantity: string];

export type BinanceDepth10Message = {
  lastUpdateId: number;
  bids: BinanceDepthLevelTuple[];
  asks: BinanceDepthLevelTuple[];
};

export type OrderbookLevel = {
  price: number;
  quantity: number;
};

export type NormalizedOrderbook = {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
};
