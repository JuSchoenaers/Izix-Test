import { redirect } from "next/navigation";

type EventAliasPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EventAliasPage({ params }: EventAliasPageProps) {
    const { id } = await params;
    redirect(`/events/${id}`);
}
