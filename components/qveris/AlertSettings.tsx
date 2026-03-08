'use client';

import { useState, useEffect } from 'react';

export default function AlertSettings() {
  const [symbol, setSymbol] = useState('');
  const [threshold, setThreshold] = useState('5');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [triggeredAlert, setTriggeredAlert] = useState<any>(null);

  const handleSetAlert = async () => {
    if (!symbol.trim() || !threshold.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      // 保存预警到本地存储
      const newAlert = {
        id: Date.now(),
        symbol: symbol.toUpperCase(),
        threshold: parseFloat(threshold),
        createdAt: new Date().toLocaleString('zh-CN'),
        status: 'active',
      };

      const savedAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      savedAlerts.push(newAlert);
      localStorage.setItem('alerts', JSON.stringify(savedAlerts));

      setAlerts(savedAlerts);
      setSymbol('');
      setThreshold('5');
      setMessage('✅ 预警设置成功！系统将每60秒检查一次价格。');
    } catch (err) {
      setMessage('❌ 设置失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    setAlerts(savedAlerts);
  }, []);

  const handleDeleteAlert = (id: number) => {
    const savedAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    const filtered = savedAlerts.filter((a: any) => a.id !== id);
    localStorage.setItem('alerts', JSON.stringify(filtered));
    setAlerts(filtered);
  };

  // 真实的价格检查逻辑
  useEffect(() => {
    const checkAlerts = async () => {
      const savedAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      const activeAlerts = savedAlerts.filter((a: any) => a.status === 'active');

      if (activeAlerts.length === 0) return;

      // 检查每个活跃的预警
      for (const alert of activeAlerts) {
        try {
          // 1. 搜索股价工具
          const searchRes = await fetch('/api/qveris/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `${alert.symbol} stock quote` }),
          });
          const searchData = await searchRes.json();

          if (searchData.results && searchData.results.length > 0) {
            const toolId = searchData.results[0].tool_id;
            const searchId = searchData.search_id;

            // 2. 执行工具获取当前价格
            const executeRes = await fetch('/api/qveris/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                toolId,
                searchId,
                parameters: { symbol: alert.symbol },
              }),
            });
            const result = await executeRes.json();

            if (result.success && result.result && result.result.data) {
              const changePercent = result.result.data.dp;

              // 检查是否触发预警
              if (Math.abs(changePercent) >= alert.threshold) {
                setTriggeredAlert({
                  ...alert,
                  changePercent: changePercent.toFixed(2),
                });

                // 3秒后自动关闭预警
                setTimeout(() => setTriggeredAlert(null), 3000);
                break; // 一次只触发一个预警
              }
            }
          }
        } catch (err) {
          console.error(`Failed to check alert for ${alert.symbol}:`, err);
        }
      }
    };

    // 每60秒检查一次预警
    const interval = setInterval(checkAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 预警横幅 */}
      {triggeredAlert && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-4 px-6 shadow-lg z-50 animate-pulse">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-lg">价格预警触发！</p>
                <p className="text-sm">
                  {triggeredAlert.symbol} 价格涨跌 {triggeredAlert.changePercent}%，超过阈值 {triggeredAlert.threshold}%
                </p>
              </div>
            </div>
            <button
              onClick={() => setTriggeredAlert(null)}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 border border-green-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">⏰</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">价格预警设置</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✅ 已就绪
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          设置股价预警，当涨跌幅超过阈值时自动在页面顶部显示预警通知（每60秒自动检查）
        </p>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="股票代码（如 TSLA）"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="阈值（%）"
            className="w-32 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSetAlert}
            disabled={loading}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '设置中...' : '设置预警'}
          </button>
        </div>

        {message && (
          <div className={`rounded-lg p-4 mb-4 ${message.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={message.includes('✅') ? 'text-green-700' : 'text-red-700'}>{message}</p>
          </div>
        )}

        {alerts.length > 0 && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📋</span> 已设置的预警 ({alerts.length})
            </h3>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">{alert.symbol}</span>
                    <span className="text-gray-600">涨跌超 {alert.threshold}% 预警</span>
                    <span className="text-gray-500 text-sm">{alert.createdAt}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {alert.status === 'active' ? '✅ 活跃' : '⏸️ 已暂停'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>💡 说明：</strong>
            预警设置保存在浏览器本地存储中。系统每60秒自动检查一次价格，当涨跌幅超过阈值时会触发预警通知。
          </p>
        </div>
      </div>
    </>
  );
}
