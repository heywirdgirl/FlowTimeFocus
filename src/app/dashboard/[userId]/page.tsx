export default function Page({ params }: { params: { userId: string } }) {
  return <h1>Workspace for {params.userId}</h1>;
}
