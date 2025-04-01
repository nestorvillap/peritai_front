const DefectList = ({ currentImage, currentIndex, approvals, handleApproval }) => (
    <div className="mt-4">
        <h4 className="font-bold mb-2">Desperfectos detectados:</h4>
        <ul className="space-y-2">
            {currentImage.desperfectos.map((desperfecto, defectIndex) => (
                <li key={defectIndex} className="bg-gray-100 p-3 rounded">
                    <p className={"font-bold"}>Localización: <span className={"font-normal"}>{desperfecto.localizacion}</span></p>
                    <p className={"font-bold"}>Tipo: <span className={"font-normal"}>{desperfecto.tipo}</span></p>
                    <p className={"font-bold"}>Descripción: <span className={"font-normal"}>{desperfecto.descripcion}</span></p>
                    <p className={"font-bold"}>Gravedad: <span className={"font-normal"}>{desperfecto.gravedad}</span></p>
                    <div className="mt-2 flex gap-4">
                        <button 
                            className={`px-4 py-2 rounded ${
                                approvals[`${currentIndex}-${defectIndex}`] === true 
                                    ? 'bg-primary text-white' 
                                    : 'border-2'
                            }`}
                            onClick={() => handleApproval(currentIndex, defectIndex, true)}
                        >
                            ✓ Aprobar
                        </button>
                        <button 
                            className={`px-4 py-2 rounded ${
                                approvals[`${currentIndex}-${defectIndex}`] === false 
                                    ? 'bg-primary text-white' 
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
    </div>
);

export default DefectList;
