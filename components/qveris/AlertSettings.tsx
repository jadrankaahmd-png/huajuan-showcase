'use client';

// QVeris credits 预留给第三层选股推荐使用
// 暂停用户端直接调用，等第三层上线后恢复

import FeatureDisabled from './FeatureDisabled';

export default function AlertSettings() {
  return <FeatureDisabled featureName="价格预警设置" />;
}

/*
原有代码保留：
'use client';

import { useState } from 'react';

export default function AlertSettings() {
  const [symbol, setSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSetAlert = async () => {
    if (!symbol.trim() || !targetPrice) return;

    setLoading(true);
    setMessage('');

    try {
      // 这里应该调用后端 API 设置预警
      // 暂时模拟成功
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage(`✅ 已设置 ${symbol.toUpperCase()} ${condition === 'above' ? '高于' : '低于'} $${targetPrice} 预警`);
    } catch (err: any) {
      setMessage(`❌ 设置失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 border border-green-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">⏰</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">价格预警设置</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ✅ 已就绪
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              股票代码
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="例如: AAPL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标价格
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="例如: 150.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            触发条件
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setCondition('above')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                condition === 'above'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📈 高于目标价
            </button>
            <button
              onClick={() => setCondition('below')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                condition === 'below'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📉 低于目标价
            </button>
          </div>
        </div>

        <button
          onClick={handleSetAlert}
          disabled={loading || !symbol.trim() || !targetPrice}
          className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '设置中...' : '设置预警'}
        </button>

        {message && (
          <div className={`rounded-lg p-4 ${
            message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
*/
