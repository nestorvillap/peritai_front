import { useState, useEffect } from 'preact/hooks';
import { IconRefresh } from '@tabler/icons-preact';

const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [evaluationData, setEvaluationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvals, setApprovals] = useState({});
    const [allDefectsReviewed, setAllDefectsReviewed] = useState(false);

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
    
    let { danios_detectados, datos_vehiculo } = evaluationData;
    
    if (!danios_detectados || danios_detectados.length === 0) {
        return <div className="max-w-4xl mx-auto p-4">
            
            <section class="max-w-4xl mx-auto flex gap-4 justify-between mt-20 bg-[#00008F] text-white px-4 py-2 rounded-md">
                <div class="flex flex-col ">
                    <h1 class="font-bold text-2xl">Matrícula</h1>
                    <p class="text-xl">{datos_vehiculo.matricula}</p>
                </div>
                <div class="flex flex-col">
                    <h1 class="font-bold text-2xl">Modelo</h1>
                    <p class="text-xl">{datos_vehiculo.marca} {datos_vehiculo.modelo}</p>
                </div>
                <div class="flex flex-col">
                    <h1 class="font-bold text-2xl">Año</h1>
                    <p class="text-xl">{datos_vehiculo.anio}</p>
                </div>
                <div class="flex flex-col">
                    <h1 class="font-bold text-2xl">Estado</h1>
                    <p class="text-xl">Procesando</p>
                </div>
                <button 
                onClick={() => window.location.reload()}
                className="mt-4 cursor-pointer px-4 py-2 rounded-md transition-colors flex"
            >
                <IconRefresh/>
            </button>
            </section>
        </div>;
    }    

    if ( danios_detectados.length === 0) {
        return <div className="max-w-4xl mx-auto p-4">Tu vehiculo a pasado todos los test </div>;
    }    

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

    const handleApproval = (imageIndex, defectIndex, isApproved) => {
        const key = `${imageIndex}-${defectIndex}`;
        setApprovals(prev => ({
            ...prev,
            [key]: isApproved
        }));

        // Verifica si todos los defectos han sido revisados
        const updatedApprovals = { ...approvals, [key]: isApproved };
        checkAllDefectsReviewed(updatedApprovals);
    };

    const checkAllDefectsReviewed = (currentApprovals) => {
        let totalDefects = 0;
        let reviewedDefects = 0;

        danios_detectados.forEach((imagen, imgIndex) => {
            imagen.desperfectos.forEach((_, defIndex) => {
                totalDefects++;
                if (currentApprovals[`${imgIndex}-${defIndex}`] !== undefined) {
                    reviewedDefects++;
                }
            });
        });

        setAllDefectsReviewed(totalDefects === reviewedDefects);
    };

    const handleFinalSubmit = () => {
        // Verifica si hay algún rechazo
        const hasRejections = Object.values(approvals).some(approval => approval === false);
        
        // Guarda el resultado en localStorage para la siguiente página
        localStorage.setItem('evaluationResult', JSON.stringify({
            approvals,
            hasRejections
        }));

        // Redirecciona según el resultado
        if (hasRejections) {
            window.location.href = '/fail';
        } else {
            window.location.href = '/successDamage';
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto p-4 mt-10">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Datos del vehículo */}
                <div className="mb-6 text-center flex flex-col items-">
                    <h2 className="text-2xl font-bold mb-4">Datos del Vehículo</h2>
                    <div className="flex gap-2 justify-center">
                        <p><strong>Matrícula:</strong> {datos_vehiculo.matricula}</p>
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
                                    {currentImage.desperfectos.map((desperfecto, defectIndex) => (
                                        <li key={defectIndex} className="bg-gray-100 p-3 rounded">
                                            <p><strong>Localización:</strong> {desperfecto.localizacion}</p>
                                            <p><strong>Tipo:</strong> {desperfecto.tipo}</p>
                                            <p><strong>Descripción:</strong> {desperfecto.descripcion}</p>
                                            <p><strong>Gravedad:</strong> {desperfecto.gravedad}</p>
                                            
                                            {/* Botones de aprobación */}
                                            <div className="mt-2 flex gap-4">
                                                <button 
                                                    className={`px-4 py-2 rounded transition-all ${
                                                        approvals[`${currentIndex}-${defectIndex}`] === true 
                                                            ? 'bg-green-500 text-white' 
                                                            : 'border-2'
                                                    }`}
                                                    onClick={() => handleApproval(currentIndex, defectIndex, true)}
                                                >
                                                    ✓ Aprobar
                                                </button>
                                                <button 
                                                    className={`px-4 py-2 rounded transition-all ${
                                                        approvals[`${currentIndex}-${defectIndex}`] === false 
                                                            ? 'bg-red-500 text-white' 
                                                            : 'border-2'
                                                    }`}
                                                    onClick={() => handleApproval(currentIndex, defectIndex, false)}
                                                >
                                                    ✗ Rechazar
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Botón de finalizar revisión */}
                                {allDefectsReviewed && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={handleFinalSubmit}
                                            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                                        >
                                            Finalizar Revisión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={goToNext}
                            className="bg-gray-800 text-white p-2 rounded-full cursor-pointer"
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
                                className={`h-2 w-2 rounded-full cursor-pointer ${
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