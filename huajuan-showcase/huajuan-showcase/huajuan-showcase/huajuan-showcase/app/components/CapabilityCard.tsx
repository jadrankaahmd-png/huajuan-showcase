'use client';

interface Capability {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  type: string;
}

interface Props {
  capability: Capability;
  onClick: () => void;
}

export default function CapabilityCard({ capability, onClick }: Props) {
  const statusConfig = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500',
      label: '正常运行'
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      dot: 'bg-gray-400',
      label: '未启用'
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      dot: 'bg-yellow-500',
      label: '待配置'
    }
  };

  const config = statusConfig[capability.status];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-pink-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
          {capability.name}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.text} flex items-center gap-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></span>
          {config.label}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {capability.description}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="bg-gray-50 px-2 py-1 rounded">{capability.type}</span>
        <span className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
          查看详情 →
        </span>
      </div>
    </div>
  );
}
