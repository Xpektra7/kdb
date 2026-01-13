import { Features } from "./feature-list";

export default function GettingStarted() {  
    return (
        <section className="w-full mt-72 flex-col gap-6 p-page z-20">
            <div className="flex flex-col gap-4 md:max-w-3/4 mb-12">
                <h2 className="text-4xl font-bold leading-tight">Apollo turns vague project ideas into clear engineering decisions.</h2>
                <p className="text-base leading-relaxed py-2">
                    It helps you choose the right systems, understand the tradeoffs, and execute with a structured, build-ready plan—so you spend less time guessing and more time building.
                </p>
            </div>

            <Features />
                
        </section>
    );
}