import Calendar from "@/components/calendar";

type HomeProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
};

export default async function Home({ params, searchParams }: HomeProps) {
  const { id } = await params;

  return (
    <div>
      <Calendar id={id} params={await searchParams} />
    </div>
  );
}
