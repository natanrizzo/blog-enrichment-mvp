import Button from "./button";
import Typography from "./typography";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    return (
        <div className="bg-[var(--primary)] items-center border-t-1 border-[var(--secondary-border)] py-3 px-4 grid grid-cols-2">
            <Typography type="paragraph">{author}</Typography>
            <Typography type="paragraph">{creationDate}</Typography>
            <Typography type="paragraph">{publishDate}</Typography>
            <Button onClick={() => {navigate(href ?? "")}}>See more</Button>
        </div>
    )
}

export default CardFooter;