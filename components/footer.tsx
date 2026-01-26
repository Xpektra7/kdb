import { Github, Mail, } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const navigation = {
        resources: [
            { name: "Getting Started", href: "/getting-started" },
            { name: "FAQ", href: "/faq" },
        ],
        company: [
            { name: "Privacy", href: "/privacy" },
        ],
        social: [
            { name: "GitHub", href: "#", icon: Github },
            { name: "Email", href: "#", icon: Mail },
        ],
    };

    return (
        <footer className="w-full border-t border-border bg-background/80 backdrop-blur-sm mt-32">
            <div className="p-page py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-0 mb-4">
                            <Image src="/logo-text.svg" alt="Apollo Logo" width={70} height={70} />
                        </div>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
                            A structured engineering project planning system. Turn project ideas into clear, buildable plans through decision-driven engineering.
                        </p>
                        <div className="flex items-center gap-4">
                            {navigation.social.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                    aria-label={item.name}
                                >
                                    <HugeiconsIcon icon={item.icon} className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    <div>
                        <h3 className="text-sm font-bold text-foreground mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {navigation.resources.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {navigation.company.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Apollo. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Built by engineers, for engineers.
                    </p>
                </div>
            </div>
        </footer>
    );
}