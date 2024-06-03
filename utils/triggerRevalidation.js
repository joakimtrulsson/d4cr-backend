export default async function triggerRevalidation(contentToUpdate) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}api/revalidate?path=${contentToUpdate}`,
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
  } catch (error) {
    console.error('Error in triggerRevalidation:', error);
    return { response: { status: 500 }, data: { revalidated: false } };
  }
}
