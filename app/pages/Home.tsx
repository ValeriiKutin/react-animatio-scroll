'use client'

import { useState, useEffect } from "react";

const mySlides = [
    {
        id: 0,
        topLeft: "Секція 1 - Верхній текст",
        bottomLeft: "Секція 1 - Нижній текст",
        image: "/img1.jpg",
    },
    {
        id: 1,
        topLeft: "Секція 2 - Верхній текст",
        bottomLeft: "Секція 2 - Нижній текст",
        image: "/img2.jpeg",
    },
    {
        id: 2,
        topLeft: "Секція 3 - Верхній текст",
        bottomLeft: "Секція 3 - Нижній текст",
        image: "/img3.jpeg",
    },
    {
        id: 3,
        topLeft: "Секція 4 - Верхній текст",
        bottomLeft: "Секція 4 - Нижній текст",
        image: "/img4.jpeg",
    },
];

export default function OnePageScroll() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = (e) => {
            if (e.deltaY > 0) {
                setCurrentIndex((prev) => Math.min(prev + 1, mySlides.length - 1));
            } else if (e.deltaY < 0) {
                setCurrentIndex((prev) => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener("wheel", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("wheel", handleScroll);
        };
    }, []);

    if (!hasMounted) return null; // 💡 Fix hydration mismatch

    const translateValue = -currentIndex * 100;

    return (
        <div className="overflow-hidden h-screen w-screen relative">
            <div
                className="transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateY(${translateValue}vh)`
                }}
            >
                {mySlides.map((slide, slideIndex) => (
                    <div
                        key={slide.id}
                        className="h-screen w-screen flex"
                    >
                        <div className="w-1/2 flex flex-col justify-center p-12 bg-white">
                            <div className={`text-4xl ${slideIndex === currentIndex ? "animate-fade-in delay-500" : ""}`}>
                                {slide.topLeft}
                            </div>
                            <div className={`text-2xl mt-6 ${slideIndex === currentIndex ? "animate-slide-left delay-[1500ms]" : ""}`}>
                                {slide.bottomLeft}
                            </div>
                        </div>

                        <div
                            className="w-1/2 h-full bg-cover bg-center relative z-10"
                            style={{
                                backgroundImage: `url(${slide.image})`
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
