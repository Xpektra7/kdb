"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getDataMode, setDataMode } from "@/lib/data-mode";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
export default function Navbar() {

    const [useDummyData, setUseDummyData] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const { data: session, status } = useSession();
    const pathname = usePathname();

    // Load preference from localStorage on mount
    useEffect(() => {
        setUseDummyData(getDataMode());
    }, []);

    // Toggle and save preference
    const toggleDataMode = () => {
        const newValue = !useDummyData;
        setUseDummyData(newValue);
        setDataMode(newValue);

        // Notify user
        const message = newValue ? "Using Dummy Data" : "Using API Data";
        console.log(message);
    };

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/examples", label: "Examples" },
        { href: "/getting-started", label: "Getting Started" },
        { href: "/faq", label: "FAQ" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    const userInitials = session?.user?.name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();



    return (
        <div className={`${isActive('/auth') ? 'hidden' : 'flex'} justify-between items-center w-full p-page border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50`}>
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-0 cursor-pointer">
                <Image src="/logo-text.svg" alt="Apollo Logo" width={70} height={70} />
                </Link>
                <nav className="hidden md:flex items-center gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm transition-colors ${
                                isActive(item.href)
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            {status === "loading" ? (
                <p>...</p>
            ) : session?.user?.name ? (
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleDataMode}
                        className="hidden md:flex items-center gap-2"
                    >
                        <Badge variant={useDummyData ? "secondary" : "default"}>
                            {useDummyData ? "Dummy" : "API"}
                        </Badge>
                        <span className="text-xs">Data Mode</span>
                    </Button>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsUserMenuOpen((open) => !open)}
                            className="flex items-center gap-2 rounded-full border border-border px-2 py-1.5 text-sm"
                            aria-haspopup="menu"
                            aria-expanded={isUserMenuOpen}
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                {userInitials ?? "U"}
                            </span>
                            <span className="hidden sm:inline">{session.user.name}</span>
                        </button>
                        {isUserMenuOpen ? (
                            <div
                                role="menu"
                                className="absolute right-0 mt-2 w-44 rounded-md border border-border bg-background shadow-md"
                            >
                                <Link
                                    href="/auth"
                                    className="block px-4 py-2 text-sm hover:bg-muted"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    Account
                                </Link>
                                <button
                                    type="button"
                                    className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsMobileOpen((open) => !open)}
                        aria-expanded={isMobileOpen}
                        aria-controls="mobile-nav"
                    >
                        Menu
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleDataMode}
                        className="flex items-center gap-2"
                    >
                        <Badge variant={useDummyData ? "secondary" : "default"}>
                            {useDummyData ? "Dummy" : "API"}
                        </Badge>
                        <span className="text-xs">Data Mode</span>
                    </Button>
                    <Link href="/auth/login" >
                        <Button variant="default" size="lg" className="py-2 h-fit">Sign in</Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsMobileOpen((open) => !open)}
                        aria-expanded={isMobileOpen}
                        aria-controls="mobile-nav"
                    >
                        Menu
                    </Button>
                </div>
            )}
            {isMobileOpen ? (
                <div
                    id="mobile-nav"
                    className="absolute left-0 top-full w-full border-b border-border bg-background px-6 py-4 md:hidden"
                >
                    <nav className="flex flex-col gap-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm ${
                                    isActive(item.href)
                                        ? "text-foreground font-medium"
                                        : "text-muted-foreground"
                                }`}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {session?.user?.name ? (
                            <button
                                type="button"
                                className="text-left text-sm text-muted-foreground"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                Sign out
                            </button>
                        ) : null}
                    </nav>
                </div>
            ) : null}
        </div>
    );
}