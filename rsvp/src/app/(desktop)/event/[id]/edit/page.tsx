import { redirect } from "next/navigation";

type EventEditAliasPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EventEditAliasPage({ params }: EventEditAliasPageProps) {
    const { id } = await params;
    redirect(`/events/${id}/edit`);
}
