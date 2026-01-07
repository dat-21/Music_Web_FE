import { cva } from "class-variance-authority"

export const cardVariants = cva(
    "rounded-xl border bg-card text-card-foreground transition",
    {
        variants: {
            variant: {
                default: "shadow-sm",
                outline: "border-2",
                primary: "bg-blue-500 text-white border-blue-500",
                danger: "bg-red-500 text-white border-red-500",
            },
            size: {
                sm: "p-3",
                md: "p-5",
                lg: "p-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
)
