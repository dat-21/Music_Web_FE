import { cva } from "class-variance-authority"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "cursor-pointer bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md",
                text:
                    "cursor-pointer text-gray-400 hover:text-white text-sm font-semibold",

                destructive:
                    "cursor-pointer bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-md",
                outline:
                    "cursor-pointer border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md",
                secondary:
                    "cursor-pointer bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-md",
                ghost: "cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md",
                link: "cursor-pointer text-primary underline-offset-4 hover:underline",
                // Pill variants cho Homepage navigation tabs
                pill: "cursor-pointer rounded-full bg-gray-800 text-white hover:bg-gray-700 font-semibold",
                pillActive: "cursor-pointer rounded-full bg-white text-black hover:scale-105 font-semibold",
                // Icon overlay cho play/pause buttons
                iconOverlay: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer",
                // Scroll navigation buttons (left/right arrows) - sử dụng với group/scroll
                scrollNav: "cursor-pointer absolute top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white w-12 h-12 rounded-full shadow-xl [&_svg]:size-6",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-8",
                icon: "h-9 w-9",
                pill: "px-4 py-2 text-sm",
                text: "p-0 h-auto",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export { buttonVariants }