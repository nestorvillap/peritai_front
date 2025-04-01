import { useState } from "preact/hooks";
import { IconUpload, IconCheck } from '@tabler/icons-preact';

const CarImagesUpload = ({ formData, handleChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUploadedFiles((prev) => ({
      ...prev,
      [name]: files.length > 0,
    }));
    handleChange(e);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold">Sube las fotos de tu coche:</h2>
      <div className="grid grid-cols gap-4">
        {Object.keys(formData.carImages).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <label>
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ').replace("frontal", "Frontal").replace("parte trasera", "Parte trasera").replace("lateral izquierdo", "Lateral izquierdo").replace("lateral derecho", "Lateral derecho")}:{" "}
            </label>
            <div className="relative flex items-center">
              <input
                type="file"
                id={`car-image-${key.replace(/_/g, ' ')}`} // Corregido para evitar duplicados
                name={`car-image-${key.replace(/_/g, ' ')}`}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                tabIndex="-1" // Evita que el input sea enfocado directamente
              />
              <label
                htmlFor={`car-image-${key.replace(/_/g, ' ')}`} // Corregido para evitar duplicados
                className="border-2 px-4 py-2 rounded-sm cursor-pointer hover:scale-105 transition-all flex items-center gap-2"
              >
                {uploadedFiles[`car-image-${key.replace(/_/g, ' ')}`] ? (
                  <IconCheck className="text-primary" />
                ) : (
                  <IconUpload/>
                )}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarImagesUpload;
