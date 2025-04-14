import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSelector } from "react-redux";;
import Navigation from "../components/Navigation";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import { BackgroundLines } from "../components/ui/background-lines";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";
import { LampContainer } from "../components/ui/lamp";

// const World = React.lazy(() => import("../components/ui/globe"));

// export function GlobeDemo() {
//     const globeConfig = {
//         pointSize: 4,
//         globeColor: "#062056",
//         showAtmosphere: true,
//         atmosphereColor: "#FFFFFF",
//         atmosphereAltitude: 0.1,
//         emissive: "#062056",
//         emissiveIntensity: 0.1,
//         shininess: 0.9,
//         polygonColor: "rgba(255,255,255,0.7)",
//         ambientLight: "#38bdf8",
//         directionalLeftLight: "#ffffff",
//         directionalTopLight: "#ffffff",
//         pointLight: "#ffffff",
//         arcTime: 1000,
//         arcLength: 0.9,
//         rings: 1,
//         maxRings: 3,
//         initialPosition: { lat: 22.3193, lng: 114.1694 },
//         autoRotate: true,
//         autoRotateSpeed: 0.5,
//     };

//     const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
//     const sampleArcs = [
//         {
//             order: 1,
//             startLat: -19.885592,
//             startLng: -43.951191,
//             endLat: -22.9068,
//             endLng: -43.1729,
//             arcAlt: 0.1,
//             color: colors[Math.floor(Math.random() * (colors.length - 1))],
//         },
//         // Additional arcs omitted for brevity
//     ];

//     return (
//         <Suspense fallback={<div>Loading Globe...</div>}>
//             <World config={globeConfig} arcs={sampleArcs} />  {/* Make sure to pass props correctly */}
//         </Suspense>
//     );
// }

const About = () => {

    const [allCategories, setAllCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const ref = useRef(null);

    const handleFetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/category/getAllCategories`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setAllCategories(data.allCategories);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        handleFetchCategories();
    }, []);

    // Handle outside clicks to close the modal
    useOutsideClick(ref, () => setActiveCategory(null));

    // Handle escape key to close the modal
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Escape") setActiveCategory(null);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <>
            <div className="relative ">
                <div className="relative z-20">
                    <Navigation />
                    <Navbar />
                </div>
                <div className="relative z-10 w-full h-[1000px] bg-slate-950 overflow-y-scroll">
                    {/* <BackgroundLines className="absolute inset-0 -z-10" /> */}
                    <LampContainer>
                        <motion.h1
                            initial={{ opacity: 0.5, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
                        >
                            {/* <BackgroundLines className="absolute inset-0 -z-10" /> */}
                            <div className="flex items-center justify-center flex-col px-4">
                                <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 font-bold tracking-tight">
                                    Welcome to <br /> Kaydi Ecommerce!
                                </h2>
                                <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
                                    Discover the finest selection of products, curated just for you.
                                    Shop with confidence, enjoy exclusive deals, and experience
                                    seamless shopping all in one place. Your satisfaction is our priority!
                                </p>
                            </div>
                        </motion.h1>
                    </LampContainer>

                    {/* Globe map here */}
                    {/* <GlobeDemo /> */}

                    {/* Categories Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6 ">
                        {allCategories.map((category) => (
                            <motion.div
                                key={category._id}
                                layoutId={category._id}
                                className="bg-white dark:bg-neutral-800 shadow-md rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => setActiveCategory(category)}
                            >
                                <motion.img
                                    src={category.heroImage}
                                    alt={category.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {Array.isArray(category.description)
                                            ? category.description.join(", ")
                                            : category.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Modal for Active Category */}
                    <AnimatePresence>
                        {activeCategory && (
                            <motion.div
                                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    layoutId={activeCategory._id}
                                    ref={ref}
                                    className="bg-white dark:bg-neutral-900 rounded-lg max-w-lg w-full p-6 shadow-lg relative"
                                >
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className="absolute top-2 right-2 bg-neutral-200 dark:bg-neutral-700 rounded-[50%] px-[10px] py-[5px] text-black dark:text-white"
                                        aria-label="Close modal"
                                    >
                                        &times;
                                    </button>
                                    <motion.img
                                        src={activeCategory.heroImage}
                                        alt={activeCategory.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="mt-4">
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                            {activeCategory.title}
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                            {Array.isArray(activeCategory.description)
                                                ? activeCategory.description.join(", ")
                                                : activeCategory.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
            <Footer />
        </>
    );
};

export const CloseIcon = () => (
    <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
            opacity: 0,
            transition: { duration: 0.05 },
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-black"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
    </motion.svg>
);

export default About;
