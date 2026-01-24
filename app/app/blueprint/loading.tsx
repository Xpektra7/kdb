import Navbar from "@/components/navbar";
import { ExportButton } from "@/components/pdf-export/ExportButton";
import { Button } from "@/components/ui/button";

export default function Loading() {

    return (
        <main className="relative p-page-lg flex h-auto flex-col items-center justify-center max-w-360 py-0 pb-12 mx-auto">
            <div className="flex flex-col max-w-6xl mx-auto w-full px-4 py-4 gap-8">
                <div
                    className="fixed top-0 left-0 right-0 md:relative flex w-full justify-between border-b border-border p-4 md:p-6 bg-background/95 backdrop-blur-sm md:px-0"
                >
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Blueprint</h1>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <ExportButton buttonText="Export PDF" fileName="blueprint-report.pdf" />
                        <Button variant="outline" size="lg" className="py-2 h-fit">Back</Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center h-[80dvh] py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
        </main>
    );
}