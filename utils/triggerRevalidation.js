export default async function triggerRevalidation(contentToUpdate) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/revalidate?path=${contentToUpdate}`,
    {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Headers': 'Authorization',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STATIC_REVALIDATE_TOKEN}`,
      },
    }
  );

  const data = await response.json();

  return { response, data };
}
