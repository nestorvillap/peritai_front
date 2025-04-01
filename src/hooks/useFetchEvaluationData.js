import { useState, useEffect } from 'preact/hooks';

const useFetchEvaluationData = () => {
    const [evaluationData, setEvaluationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvaluationData = async () => {
            try {
                const evaluationId = localStorage.getItem('evaluationId');
                if (!evaluationId) throw new Error('No hay ID de evaluación disponible');
                const response = await fetch(`/api/download?evaluation_id=${evaluationId}`);
                if (!response.ok) throw new Error('Error al obtener los datos');
                const data = await response.json();
                setEvaluationData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvaluationData();
    }, []);

    return { evaluationData, loading, error };
};

export default useFetchEvaluationData;
