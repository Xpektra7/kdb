export default function Loading() {
  return (
    <div className="flex bg-red-500 flex-col items-center justify-center h-full p-4 space-y-4">
      <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600">Generating Blueprint...</p>
    </div>
  );
}