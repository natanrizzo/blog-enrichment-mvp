import CardFooter from "./cardFooter";
import CardTitle from "./cardTitle";
import CardContent from "./cardContent";

type CardProps = {
    className?: string;
    href: string;
    title: string;
    author: string;
    text: string;
    creationDate: string;
    publishDate: string;
}

const Card = ({
    className,
    href,
    title,
    author,
    text,
    creationDate,
    publishDate,
}: CardProps) => {
    const baseClassname = "bg-[var(--card)] rounded-md transition-all shadow-sm duration-300 hover:shadow-md";
    const cardClassname = `${baseClassname} ${className}`;

    return (
        <div className={cardClassname}>
            <CardTitle title={title} />
            <CardContent text={text} />
            <CardFooter
                href={href}
                author={author} 
                creationDate={creationDate} 
                publishDate={publishDate}
            />
        </div>
    )
}

export default Card;