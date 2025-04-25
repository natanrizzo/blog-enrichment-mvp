import Typography from "./typography";

type CardContentProps = {
    text: string;
}

const CardContent = ({
    text,
}: CardContentProps) => {
    return (
        <div className="bg-[var(--card)] p-4 max-h-24 overflow-hidden">
            <Typography type="paragraph">{text}</Typography>
        </div>
    )
}

export default CardContent;