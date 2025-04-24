import Typography from "./typography";

type CardTitleProps = {
    title: string;
}

const CardTitle = ({
    title,
}: CardTitleProps) => {
    return (
        <div className="bg-[var(--primary)] p-4 border-b-1 border-[var(--secondary-border)]">
            <Typography type="title">{title}</Typography>
        </div>
    )
}

export default CardTitle;