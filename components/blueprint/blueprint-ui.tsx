

interface ApolloHeaderProps {
  projectName: string;
}

export function ApolloHeader({ projectName }: ApolloHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 wrap-break-words">
        {projectName}
      </h1>
      <p className="text-slate-600 text-xs sm:text-sm">Blueprint</p>
    </div>
  );
}