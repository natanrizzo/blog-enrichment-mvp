import { ElementType, ReactNode } from "react"

type TypographyProps = {
    type: "title" | "subtitle" | "paragraph" | "caption";
    href?: string;
    children: ReactNode;
    className?: string;
}

const typeElements: Record<NonNullable<TypographyProps["type"]>, ElementType> = {
    "title": 'h1',
    "subtitle": "h2",
    "paragraph": "p",
    "caption": "p",
}

const typeStyles: Record<NonNullable<TypographyProps["type"]>, string> = {
    "title": "font-bold text-2xl",
    "subtitle": "font-bold text-xl",
    "paragraph": "text-md",
    "caption": "font-light text-sm",
}

const Typography = ({
    type = "paragraph",
    href,
    className,
    children,
}: TypographyProps) => {
    const baseClassName = "";
    const typoClassName = typeStyles[type];

    const Typo = typeElements[type];
    const content = <Typo
        className={`${baseClassName} ${typoClassName} ${className}`}
    >
        { children }
    </Typo>

    return href
    ? <a href={href}>{content}</a>
    : content;
}

export default Typography;