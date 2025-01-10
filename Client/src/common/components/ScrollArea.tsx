function ScrollArea ({
                        children,
                        className = '',
                        maxHeight = 'none'
                    }: {
    children: React.ReactNode;
    className?: string;
    maxHeight?: string | number;
}) {
    return (
        <div
            className={`overflow-y-auto ${className}`}
            style={{
                maxHeight: maxHeight,
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(203 213 225) transparent'
            }}
        >
            {children}
        </div>
    );
}

export default ScrollArea;