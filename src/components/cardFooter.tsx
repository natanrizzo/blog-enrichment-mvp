import Button from "./button";
import Typography from "./typography";

type CardFooterProps = {
    href?: string;
    author?: string;
    creationDate?: string;
    publishDate?: string;
}

const CardFooter = ({
    href,
    author,
    creationDate,
    publishDate,
}: CardFooterProps) => {
    return (
        <div className="bg-[var(--primary)] items-center border-t-1 border-[var(--secondary-border)] py-3 px-4 grid grid-cols-2">
            <Typography type="paragraph">{author}</Typography>
            <Typography type="paragraph">{creationDate}</Typography>
            <Typography type="paragraph">{publishDate}</Typography>
            <Button onClick={() => {}}>See more</Button>
        </div>
    )
}

export default CardFooter;