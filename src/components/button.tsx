type ButtonProps = {
    children: string;
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
}
const Button = ({
    children,
    size,
    onClick,
}: ButtonProps) => {
    return (
        <button
            className="bg-[var(--button)] font-bold text-white px-3 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-[var(--primary)]"
            onClick={onClick}
        >
            { children }
        </button>
    )
}

export default Button;