import { useState } from 'preact/hooks';
import useFetchEvaluationData from '../../hooks/useFetchEvaluationData';
import VehicleInfo from './VehicleInfo';
import ImageSlider from './ImageSlider';
import DefectList from './DefectList';
import FinalReviewButton from './FinalReviewButton';
import NoData from './NoData';
import ErrorMessage from './Error';
import Loading from './Loading';

const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [approvals, setApprovals] = useState({});
    const [allDefectsReviewed, setAllDefectsReviewed] = useState(false);
    const { evaluationData, loading, error } = useFetchEvaluationData();

    if (loading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;
    if (!evaluationData) return <NoData />;

    const { danios_detectados, datos_vehiculo } = evaluationData;

    if (!danios_detectados || danios_detectados.length === 0) {
        return <VehicleInfo datos_vehiculo={datos_vehiculo} />;
    }

    const currentImage = danios_detectados[currentIndex];

    const handleApproval = (imageIndex, defectIndex, isApproved) => {
        const key = `${imageIndex}-${defectIndex}`;
        setApprovals(prev => ({ ...prev, [key]: isApproved }));
        const updatedApprovals = { ...approvals, [key]: isApproved };
        checkAllDefectsReviewed(updatedApprovals);
    };

    const checkAllDefectsReviewed = (currentApprovals) => {
        let totalDefects = 0, reviewedDefects = 0;
        danios_detectados.forEach((imagen, imgIndex) => {
            imagen.desperfectos.forEach((_, defIndex) => {
                totalDefects++;
                if (currentApprovals[`${imgIndex}-${defIndex}`] !== undefined) reviewedDefects++;
            });
        });
        setAllDefectsReviewed(totalDefects === reviewedDefects);
    };

    const handleFinalSubmit = () => {
        const hasRejections = Object.values(approvals).some(approval => approval === false);
        localStorage.setItem('evaluationResult', JSON.stringify({ approvals, hasRejections }));
        window.location.href = hasRejections ? '/fail' : '/successDamage';
    };

    return (
        <div className="max-w-4xl mx-auto p-4 mt-10">
            <div className="bg-white rounded-lg ">
                <div className="mb-6 flex flex-col">
                    <h2 className="text-2xl font-bold mb-4">Datos del Vehículo</h2>
                    <div className={"flex gap-2 justify-center"}>
                        <p className={"font-bold"}>Matrícula: <span className={"font-normal"}>{datos_vehiculo.matricula}</span></p>
                        <p className={"font-bold"}>Modelo: <span className={"font-normal"}>{datos_vehiculo.modelo}</span></p>
                        <p className={"font-bold"}>Año: <span className={"font-normal"}>{datos_vehiculo.anio}</span></p>
                    </div>
                </div>
                <ImageSlider 
                    danios_detectados={danios_detectados} 
                    currentIndex={currentIndex} 
                    setCurrentIndex={setCurrentIndex} 
                />
                <DefectList 
                    currentImage={currentImage} 
                    currentIndex={currentIndex} 
                    approvals={approvals} 
                    handleApproval={handleApproval} 
                />
                <FinalReviewButton 
                    allDefectsReviewed={allDefectsReviewed} 
                    handleFinalSubmit={handleFinalSubmit} 
                />
            </div>
        </div>
    );
};

export default Slider;