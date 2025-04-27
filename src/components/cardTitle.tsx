import Typography from "./typography";

type CardTitleProps = {
    title: string;
    blog?: string;
}

const CardTitle = ({
    title,
    blog,
}: CardTitleProps) => {
    return (
        <div className="bg-[var(--card)] p-4 border-b-1 border-[var(--secondary-border)]">
            <Typography type="title">{title}</Typography>
            <Typography type="subtitle" href={blog}>{blog}</Typography>
        </div>
    )
}

export default CardTitle;