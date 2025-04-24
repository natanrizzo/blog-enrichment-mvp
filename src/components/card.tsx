import { ReactNode } from "react";
import CardFooter from "./cardFooter";
import CardTitle from "./cardTitle";
import CardContent from "./cardContent";

type CardProps = {
    className?: string; 
}

const Card = ({
    className,
}: CardProps) => {
    const baseClassname = "bg-[var(--primary)] rounded-md transition-all shadow-sm duration-300 hover:shadow-md";
    const cardClassname = `${baseClassname} ${className}`;

    return (
        <div className={cardClassname}>
            <CardTitle title="Test" />
            <CardContent text="testestetesysesyetsetsetsetstes" />
            <CardFooter author="Autor" creationDate="22-04-2025" publishDate="10-07-2022" />
        </div>
    )
}

export default Card;