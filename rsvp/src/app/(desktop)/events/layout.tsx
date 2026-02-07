export default function EventsLayout(
    {
        children,
        modal,
    }: Readonly<{
        children: React.ReactNode;
        modal: React.ReactNode;
    }>) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}