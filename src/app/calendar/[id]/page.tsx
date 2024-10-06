import Calendar from "@/components/calendar";

type HomeProps = {
  params: { id: string };
  searchParams: Record<string, string>;
};

export default async function Home({ params, searchParams }: HomeProps) {
  const id = params.id;

  return (
    <div>
      <Calendar id={id} params={searchParams} />
    </div>
  );
}
