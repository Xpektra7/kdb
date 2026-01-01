import { Features } from "./feature-list";

export default function GettingStarted() {  
    return (
        <section className="w-full flex-col gap-4 p-page z-20">
            <div className="flex flex-col gap-2 md:max-w-3/4">
                <h2 className="text-4xl">Apollo turns vague project ideas into clear engineering decisions.</h2>
                <p className="">
It helps you choose the right systems, understand the tradeoffs, and execute with a structured, build-ready plan—so you spend less time guessing and more time building.                </p>
            </div>

            <Features />
                
        </section>
    );
}