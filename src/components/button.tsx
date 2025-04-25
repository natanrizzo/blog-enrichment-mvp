type ButtonProps = {
    children: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
}
const Button = ({
    children,
    size,
    className,
    onClick,
}: ButtonProps) => {
    const baseClassName = "bg-[var(--button)] font-bold text-white px-3 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-[var(--primary)]"
    const buttonClassName = `${baseClassName} ${className}`

    return (
        <button
            className={buttonClassName}
            onClick={onClick}
        >
            { children }
        </button>
    )
}

export default Button;