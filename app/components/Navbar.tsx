"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            gsap.to(menuRef.current, { autoAlpha: 1, duration: 0.4, ease: "power3.out" });
            gsap.fromTo(linksRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power3.out", delay: 0.1 }
            );
        } else {
            gsap.to(menuRef.current, { autoAlpha: 0, duration: 0.3, ease: "power3.in" });
        }
    }, [isOpen]);

    const handleLinkClick = () => {
        setIsOpen(false);
    }

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Experience", href: "/museum" },
        { name: "Projects", href: "/about" },
        { name: "Contact", href: "/help" }
    ];

    return (
        <>
            <nav className="w-full px-4 md:px-6 py-3 flex flex-row justify-between md:grid md:grid-cols-3 items-center text-[#212121] text-[15px] border-y-[1.5px] border-[#212121] relative z-[100] bg-[#DCDBD5]">
                <div className="flex items-center gap-12">
                    <Link href="/" className="font-semibold text-base tracking-wide z-[100]">
                        RAGHAV<span className="font-normal">(Y)</span>
                    </Link>
                </div>

                <div className={`hidden md:flex items-center justify-center gap-2 flex-wrap max-w-full z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <Link
                        href="/"
                        className="underline decoration-1 underline-offset-4 decoration-[#212121]/50 hover:decoration-[#212121] transition-colors"
                    >
                        Home
                    </Link>
                    <span className="text-[#212121]/50">/</span>
                    <Link
                        href="/museum"
                        className="hover:underline decoration-1 underline-offset-4 decoration-[#212121]/50 hover:decoration-[#212121] transition-colors"
                    >
                        Experience
                    </Link>
                    <span className="text-[#212121]/50">/</span>
                    <Link
                        href="/about"
                        className="hover:underline decoration-1 underline-offset-4 decoration-[#212121]/50 hover:decoration-[#212121] transition-colors"
                    >
                        Projects
                    </Link>
                </div>

                <div className="flex justify-end items-center gap-8 w-full md:w-auto z-[100]">
                    <Link
                        href="/help"
                        className={`hidden md:block underline decoration-1 underline-offset-4 decoration-[#212121]/50 hover:decoration-[#212121] transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        Contact
                    </Link>
                    {/* Mobile & Desktop Hamburger Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex flex-col gap-[7px] p-2 focus:outline-none relative w-8 h-8 justify-center items-center cursor-pointer mix-blend-difference"
                        aria-label="Menu"
                    >
                        <span className={`block w-6 h-[1.5px] bg-[#212121] transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-[4.25px]' : ''}`}></span>
                        <span className={`block w-6 h-[1.5px] bg-[#212121] transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-[4.25px]' : ''}`}></span>
                    </button>
                </div>
            </nav>

            {/* Full Screen Overlay Menu */}
            <div
                ref={menuRef}
                className="fixed inset-0 z-[90] bg-[#DCDBD5] invisible opacity-0"
            >
                <div className="w-full h-full flex flex-col justify-end p-8 pb-16 md:justify-start md:items-end md:px-12 md:py-32">
                    <div className="flex flex-col gap-6 items-start md:items-end border-l-[1.5px] md:border-l-0 md:border-r-[1.5px] border-[#212121] pl-6 md:pl-0 md:pr-8">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                ref={(el) => { linksRef.current[index] = el; }}
                                onClick={handleLinkClick}
                                className={`text-4xl md:text-5xl font-semibold tracking-tighter uppercase text-[#212121] hover:scale-110 origin-left md:origin-right transition-transform duration-300 will-change-transform ${index === 3 ? 'mt-8 border-t-[1.5px] border-[#212121] md:border-t-0 pt-6 md:pt-0 text-3xl md:text-3xl font-medium' : ''}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
