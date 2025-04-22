import { ReactNode } from "react";
import CardFooter from "./cardFooter";

type CardProps = {
    className?: string; 
    children?: ReactNode;
}

const Card = ({
    className,
    children
}: CardProps) => {
    const baseClassname = "bg-[var(--primary)] rounded-md transition-all duration-500 hover:shadow-md";
    const cardClassname = `${baseClassname} ${className}`;

    return (
        <div className={cardClassname}>
            { children }
            <CardFooter/>
        </div>
    )
}

export default Card;