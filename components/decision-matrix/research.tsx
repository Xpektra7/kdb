export default function Research({research} : {research : string[]}) {

    return (
        <div className="w-full flex flex-col gap-2">
            <h2 className="text-xl">Research</h2>
            <ul className="list-disc flex flex-col items-start list-outside px-4 text-normal">
                {research.map((item: any, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

        </div>

    );
}