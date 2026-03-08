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
      // 1. 搜索涨幅榜工具
      const searchRes = await fetch('/api/qveris/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'US stock market top gainers movers today' }),
      });
      
      if (!searchRes.ok) {
        throw new Error('搜索API调用失败');
      }
      
      const searchData = await searchRes.json();

      if (searchData.results && searchData.results.length > 0) {
        const toolId = searchData.results[0].tool_id;
        const searchId = searchData.search_id;

        // 2. 执行工具获取涨幅榜
        const executeRes = await fetch('/api/qveris/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toolId,
            searchId,
            parameters: { function: 'TOP_GAINERS_LOSERS' },
          }),
        });
        
        if (!executeRes.ok) {
          throw new Error('执行API调用失败');
        }
        
        const result = await executeRes.json();

        if (result.success && result.result && result.result.data) {
          const data = result.result.data;
          
          // 解析涨幅榜数据
          if (data.top_gainers && Array.isArray(data.top_gainers)) {
            const stockData = data.top_gainers.slice(0, 10).map((stock: any) => ({
              symbol: stock.ticker || stock.symbol,
              name: stock.name || stock.ticker || stock.symbol,
              price: parseFloat(stock.price) || 0,
              change: parseFloat(stock.change) || 0,
              changePercent: parseFloat(stock.change_percentage || stock.changePercent || stock['change_percentage']) || 0,
            }));
            
            setStocks(stockData);
            setLastUpdate(new Date().toLocaleString('zh-CN'));
          } else {
            throw new Error('返回数据格式不正确：缺少 top_gainers 字段');
          }
        } else {
          throw new Error(result.error_message || '获取数据失败');
        }
      } else {
        throw new Error('未找到相关工具');
      }
    } catch (err: any) {
      const errorMsg = err.message || '获取榜单失败';
      setError(errorMsg);
      console.error('StockRanking error:', err);
    } finally {
      setLoading(false);
    }
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
        今日美股涨幅 TOP 10（每60秒自动刷新，数据来源：Alpha Vantage）
      </p>
      {lastUpdate && (
        <p className="text-gray-500 text-sm mb-4">
          最后更新：{lastUpdate}
        </p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">❌ {error}</p>
          <button
            onClick={fetchRanking}
            className="mt-2 text-red-700 underline hover:text-red-800"
          >
            重试
          </button>
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
                <tr key={stock.symbol || index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{stock.symbol}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{stock.name}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    ${stock.price.toFixed(2)}
                  </td>
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
