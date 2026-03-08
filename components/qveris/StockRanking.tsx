'use client';

import { useState, useEffect } from 'react';

export default function StockRanking() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchRanking = async () => {
    setLoading(true);
    setError('');

    try {
      // 预定义10只热门股票
      const symbols = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD', 'INTC', 'NFLX'];
      const stockData: any[] = [];

      // 并行获取所有股票数据
      const promises = symbols.map(async (symbol) => {
        try {
          // 搜索工具
          const searchRes = await fetch('/api/qveris/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `${symbol} stock quote` }),
          });
          const searchData = await searchRes.json();

          if (searchData.results && searchData.results.length > 0) {
            const toolId = searchData.results[0].tool_id;
            const searchId = searchData.search_id;

            // 执行工具
            const executeRes = await fetch('/api/qveris/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                toolId,
                searchId,
                parameters: { symbol },
              }),
            });
            const result = await executeRes.json();

            if (result.success && result.result.data) {
              return {
                symbol,
                name: getStockName(symbol),
                price: result.result.data.c,
                change: result.result.data.d,
                changePercent: result.result.data.dp,
              };
            }
          }
        } catch (err) {
          console.error(`Failed to fetch ${symbol}:`, err);
        }
        return null;
      });

      const results = await Promise.all(promises);
      const validResults = results.filter(Boolean).sort((a: any, b: any) => b.changePercent - a.changePercent);

      setStocks(validResults);
      setLastUpdate(new Date().toLocaleString('zh-CN'));
    } catch (err) {
      setError('获取榜单失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 股票名称映射
  const getStockName = (symbol: string) => {
    const names: Record<string, string> = {
      NVDA: '英伟达',
      AAPL: '苹果',
      TSLA: '特斯拉',
      MSFT: '微软',
      GOOGL: '谷歌',
      AMZN: '亚马逊',
      META: 'Meta',
      AMD: 'AMD',
      INTC: '英特尔',
      NFLX: '奈飞',
    };
    return names[symbol] || symbol;
  };

  useEffect(() => {
    fetchRanking();
    // 每60秒自动刷新
    const interval = setInterval(fetchRanking, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🏆</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">美股涨幅实时榜单</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✅ 已就绪
            </span>
          </div>
        </div>
        <button
          onClick={fetchRanking}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      <p className="text-gray-700 mb-2">
        今日热门美股涨幅排行（每60秒自动刷新）
      </p>
      {lastUpdate && (
        <p className="text-gray-500 text-sm mb-4">
          最后更新：{lastUpdate}
        </p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {stocks.length > 0 ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">排名</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">代码</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">名称</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">当前价</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">涨跌幅</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr key={stock.symbol} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{stock.symbol}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{stock.name}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">${stock.price.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      ) : null}
    </div>
  );
}
