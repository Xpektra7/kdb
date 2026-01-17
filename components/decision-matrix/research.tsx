export default function Research({research} : {research : string[]}) {

    return (
        <div className="w-full flex flex-col gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">Research Insights</h2>
            <div className="bg-muted/30 rounded-lg p-4 sm:p-5 md:p-6 border border-border">
                <ul className="list-disc flex flex-col items-start list-outside px-4 sm:px-5 md:px-6 gap-2 sm:gap-3 text-xs sm:text-sm md:text-base">
                    {research.map((item: string, index: number) => (
                        <li key={index} className="wrap-break-words leading-relaxed">{item}</li>
                    ))}
                </ul>
            </div>
        </div>

    );
}