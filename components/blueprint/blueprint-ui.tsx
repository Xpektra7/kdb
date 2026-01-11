

interface ApolloHeaderProps {
  projectName: string;
}

export function ApolloHeader({ projectName }: ApolloHeaderProps) {
  return (
    <div className="bg-black rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl  mb-2 wrap-break-words">
        {projectName}
      </h1>
      <p className=" text-xs sm:text-sm">Blueprint</p>
    </div>
  );
}