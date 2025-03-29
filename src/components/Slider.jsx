import { useState, useEffect } from 'preact/hooks';

const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [evaluationData, setEvaluationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvaluationData = async () => {
            try {
                // Cogeriamos el id del localstorage para el usuario
                const evaluationId = localStorage.getItem('evaluationId');

                if (!evaluationId) {
                    throw new Error('No hay ID de evaluación disponible');
                }

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

    if (loading) return <div className="max-w-4xl mx-auto p-4">Cargando...</div>;
    if (error) return <div className="max-w-4xl mx-auto p-4">Error: {error}</div>;
    if (!evaluationData) return <div className="max-w-4xl mx-auto p-4">No hay datos disponibles</div>;

    const { danios_detectados, datos_vehiculo } = evaluationData;

    const goToPrevious = () => {
        setCurrentIndex(prev => 
            prev === 0 ? danios_detectados.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex(prev => 
            prev === danios_detectados.length - 1 ? 0 : prev + 1
        );
    };

    const currentImage = danios_detectados[currentIndex];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Datos del vehículo */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Datos del Vehículo</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Matrícula:</strong> {datos_vehiculo.matricula}</p>
                        <p><strong>Marca:</strong> {datos_vehiculo.marca}</p>
                        <p><strong>Modelo:</strong> {datos_vehiculo.modelo}</p>
                        <p><strong>Año:</strong> {datos_vehiculo.anio}</p>
                    </div>
                </div>

                {/* Slider de imágenes y daños */}
                <div className="relative">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={goToPrevious}
                            className="bg-gray-800 text-white p-2 rounded-full"
                        >
                            ←
                        </button>
                        
                        <div className="flex-1 mx-4">
                            <img 
                                src={currentImage.url_image} 
                                alt={`Vista ${currentImage.tipo_imagen}`}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <h3 className="text-xl font-bold mt-4">
                                Vista: {currentImage.tipo_imagen}
                            </h3>
                            
                            {/* Lista de desperfectos */}
                            <div className="mt-4">
                                <h4 className="font-bold mb-2">Desperfectos detectados:</h4>
                                <ul className="space-y-2">
                                    {currentImage.desperfectos.map((desperfecto, index) => (
                                        <li key={index} className="bg-gray-100 p-3 rounded">
                                            <p><strong>Localización:</strong> {desperfecto.localizacion}</p>
                                            <p><strong>Tipo:</strong> {desperfecto.tipo}</p>
                                            <p><strong>Descripción:</strong> {desperfecto.descripcion}</p>
                                            <p><strong>Gravedad:</strong> {desperfecto.gravedad}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button 
                            onClick={goToNext}
                            className="bg-gray-800 text-white p-2 rounded-full"
                        >
                            →
                        </button>
                    </div>

                    {/* Indicadores de posición */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {danios_detectados.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 w-2 rounded-full ${
                                    index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slider;