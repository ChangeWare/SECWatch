function Alert ({
                   children,
                   variant = 'info',
                   className = ''
               }: {
    children: React.ReactNode;
    variant?: 'info' | 'warning' | 'error' | 'success';
    className?: string;
}) {
    const variants = {
        info: 'bg-info/10 text-info border-info/20',
        warning: 'bg-metrics-growth/10 text-metrics-growth border-metrics-growth/20',
        error: 'bg-error/10 text-error border-error/20',
        success: 'bg-success/10 text-success border-success/20'
    };

    return (
        <div className={`p-4 rounded-lg border ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
}

export default Alert;