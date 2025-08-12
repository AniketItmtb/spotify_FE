const LoadingOverlay = ({
  isVisible,
  message = "Loading...",
  currentStep = 0,
  totalSteps = 16,
}) => {
  if (!isVisible) return null;

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-lg min-w-[300px]">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-medium text-gray-200">{message}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-yellow-400 h-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div> 
      </div>
    </div>
  );
};

export default LoadingOverlay;
