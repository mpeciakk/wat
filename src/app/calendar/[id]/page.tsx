import Calendar from "@/components/calendar";

type HomeProps = { params: { id: string } };

export default async function Home({ params }: HomeProps) {
  const id = params.id;

  return (
    <div>
      <Calendar id={id} />
    </div>
  );
}
