export async function GET({ params, request }) {
  try {
    const url = new URL(request.url);
    const evaluation_id = url.searchParams.get('evaluation_id');

    if (!evaluation_id) {
      throw new Error('Se requiere el ID de evaluación');
    }

    const backendResponse = await fetch(`http://127.0.0.1:8000/evaluations/${evaluation_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!backendResponse.ok) {
      throw new Error('Error al obtener los datos de la evaluación');
    }

    const evaluationData = await backendResponse.json();

    return new Response(JSON.stringify(evaluationData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error al obtener la evaluación:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
