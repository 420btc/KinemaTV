/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                scenra: {
                    yellow: "#facc15",
                    dark: "#0a0e1a",
                    gray: "#1f1f1f",
                    accent: "#fde68a",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Poppins", "system-ui", "sans-serif"],
            },
            boxShadow: {
                glow: "0 0 15px rgba(250, 204, 21, 0.4)",
            },
            keyframes: {
                slideDown: {
                    "0%": { transform: "translateY(-10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
            animation: {
                slideDown: "slideDown 0.3s ease-out",
                fadeIn: "fadeIn 0.4s ease-in",
            },
        },
    },
    plugins: [
        require("tailwind-scrollbar-hide"),
        require("tailwind-scrollbar"),
    ],
};
