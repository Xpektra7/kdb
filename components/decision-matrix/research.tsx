import Link from "next/link";

export default function Research({research} : {research : {title: string, url: string}[]}) {

    return (
        <div className="w-full flex flex-col gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold">Research Insights</h2>
            <div className="bg-muted/20 rounded-lg p-6 border border-border">
                <ul className="list-disc flex flex-col items-start list-outside px-4 gap-2 sm:gap-3 text-sm md:text-base">
                    {research.map((item: {title: string, url: string}, index: number) => (
                        <Link key={index} href={item.url} target="_blank" className="wrap-break-words leading-relaxed text-blue hover:underline">
                            {item.title}
                        </Link>
                    ))}
                </ul>
            </div>
        </div>

    );
}