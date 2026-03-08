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
      // 保存预警到本地存储（实际项目应该保存到后端数据库）
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
      setMessage('✅ 预警设置成功！');
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

  // 模拟预警触发（实际项目应该轮询检查）
  useEffect(() => {
    const checkAlerts = async () => {
      const savedAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      const activeAlerts = savedAlerts.filter((a: any) => a.status === 'active');

      // 这里应该调用真实API检查价格是否触发阈值
      // 演示版本：随机触发一个预警
      if (activeAlerts.length > 0 && Math.random() < 0.1) {
        const randomAlert = activeAlerts[Math.floor(Math.random() * activeAlerts.length)];
        setTriggeredAlert(randomAlert);

        // 3秒后自动关闭预警
        setTimeout(() => setTriggeredAlert(null), 3000);
      }
    };

    // 每30秒检查一次预警
    const interval = setInterval(checkAlerts, 30000);
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
                  {triggeredAlert.symbol} 价格涨跌超过 {triggeredAlert.threshold}%
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
          设置股价预警，当涨跌幅超过阈值时自动在页面顶部显示预警通知
        </p>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="股票代码（如 NVDA）"
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

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>💡 说明：</strong>
            预警设置保存在浏览器本地存储中。生产环境应该保存到后端数据库并使用 WebSocket 实现实时推送。
          </p>
        </div>
      </div>
    </>
  );
}
