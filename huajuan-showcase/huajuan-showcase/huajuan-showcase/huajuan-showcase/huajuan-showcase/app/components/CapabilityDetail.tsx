'use client';

interface Capability {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  type: string;
  category: string;
  details?: {
    whatItDoes?: string;
    howItWorks?: string;
    currentStatus?: string;
    lastUpdate?: string;
    usage?: string;
    dependencies?: string[];
  };
}

interface Props {
  capability: Capability;
  onClose: () => void;
}

export default function CapabilityDetail({ capability, onClose }: Props) {
  const statusConfig = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: '✅',
      label: '正常运行'
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      icon: '⏸️',
      label: '未启用'
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: '⏳',
      label: '待配置'
    }
  };

  const config = statusConfig[capability.status];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900">{capability.name}</h2>
                <span className={`text-sm px-3 py-1 rounded-full ${config.bg} ${config.text} flex items-center gap-1`}>
                  {config.icon} {config.label}
                </span>
              </div>
              <p className="text-gray-600">{capability.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl ml-4"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">类型</div>
              <div className="font-semibold text-gray-800">{capability.type}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">分类</div>
              <div className="font-semibold text-gray-800">{capability.category}</div>
            </div>
          </div>

          {/* 详细信息 */}
          {capability.details && (
            <>
              {capability.details.whatItDoes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>🎯</span> 能做什么
                  </h3>
                  <p className="text-gray-600 bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
                    {capability.details.whatItDoes}
                  </p>
                </div>
              )}

              {capability.details.howItWorks && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>⚙️</span> 如何工作
                  </h3>
                  <p className="text-gray-600 bg-purple-50 p-4 rounded-lg whitespace-pre-wrap">
                    {capability.details.howItWorks}
                  </p>
                </div>
              )}

              {capability.details.currentStatus && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>📊</span> 当前状态
                  </h3>
                  <p className="text-gray-600 bg-green-50 p-4 rounded-lg whitespace-pre-wrap">
                    {capability.details.currentStatus}
                  </p>
                </div>
              )}

              {capability.details.lastUpdate && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>🕐</span> 最后更新
                  </h3>
                  <p className="text-gray-600">{capability.details.lastUpdate}</p>
                </div>
              )}

              {capability.details.usage && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>💡</span> 使用方法
                  </h3>
                  <code className="block bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                    {capability.details.usage}
                  </code>
                </div>
              )}

              {capability.details.dependencies && capability.details.dependencies.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>🔗</span> 依赖项
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {capability.details.dependencies.map((dep, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-4">
          <button
            onClick={onClose}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
