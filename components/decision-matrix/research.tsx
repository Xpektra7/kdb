export default function Research({research} : {research : string[]}) {

    return (
        <div className="w-full flex flex-col gap-2 sm:gap-3">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">Research</h2>
            <ul className="list-disc flex flex-col items-start list-outside px-4 sm:px-5 md:px-6 gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
                {research.map((item: any, index: number) => (
                    <li key={index} className="break-words">{item}</li>
                ))}
            </ul>

        </div>

    );
}