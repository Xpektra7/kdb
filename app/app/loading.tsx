import Navbar from "@/components/navbar";

export default function Loading() {

    return (
        <main className="relative p-page-lg flex h-auto flex-col items-center justify-center max-w-360 py-0 pb-12 mx-auto">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[80dvh] py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
        </main>
    );
}