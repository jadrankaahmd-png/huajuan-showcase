// QVeris credits 预留给第三层选股推荐使用
// 暂停用户端直接调用，等第三层上线后恢复

export default function FeatureDisabled({ featureName }: { featureName: string }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="flex items-center justify-center mb-6">
        <div className="text-5xl">🔒</div>
      </div>

      <h2 className="text-2xl font-bold text-gray-400 text-center mb-4">
        {featureName}
      </h2>

      <div className="flex justify-center mb-4">
        <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-full text-sm font-medium">
          暂时无法使用
        </span>
      </div>

      <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
        该功能正在升级中，将在第三层上线后开放
      </p>

      <div className="flex justify-center">
        <button
          disabled
          className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
        >
          功能升级中
        </button>
      </div>
    </div>
  );
}
