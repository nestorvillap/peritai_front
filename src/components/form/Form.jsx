import { useState, useRef } from 'preact/hooks';
import CarDetailsForm from './CarDetailsForm';
import CarImagesUpload from './CarImagesUpload';
import SubmitButton from './SubmitButton';

const Form = () => {
  const [formData, setFormData] = useState({
    plate: '',
    carModel: '',
    year: '',
    carImages: {
      frontal: null,
      'parte trasera': null,
      'lateral izquierdo': null,
      'lateral derecho': null
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith('car-image-')) {
      const imageType = name.replace('car-image-', '').replace(/_/g, ' ');
      setFormData(prev => ({
        ...prev,
        carImages: {
          ...prev.carImages,
          [imageType]: files[0]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validación manual de imágenes requeridas
    const requiredImages = ['frontal', 'parte trasera', 'lateral izquierdo', 'lateral derecho'];
    for (const imageType of requiredImages) {
      if (!formData.carImages[imageType]) {
        setSubmitStatus({ success: false, message: `Falta la imagen: ${imageType}` });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('plate', formData.plate);
      formDataToSend.append('carModel', formData.carModel);
      formDataToSend.append('year', formData.year);

      Object.entries(formData.carImages).forEach(([type, file]) => {
        if (file) {
          formDataToSend.append(`carImage-${type}`, file);
        }
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el formulario');
      }

      if (result.evaluation_id) {
        localStorage.setItem('evaluationId', result.evaluation_id);
      }

      setSubmitStatus({ success: true, message: 'Formulario enviado correctamente' });

      setFormData({
        plate: '',
        carModel: '',
        year: '',
        carImages: {
          frontal: null,
          'parte trasera': null,
          'lateral izquierdo': null,
          'lateral derecho': null
        }
      });

    } catch (error) {
      console.error('Error en el envío:', error);
      setSubmitStatus({ success: false, message: 'Error al enviar el formulario: ' + error.message });
    } finally {
      setIsSubmitting(false);
      window.location.href = '/user';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-4xl mx-auto flex flex-col items-center">
      <div className="flex flex-col gap-4 w-full">
        <CarDetailsForm formData={formData} handleChange={handleChange} />
        <CarImagesUpload formData={formData} handleChange={handleChange} />
      </div>
      {submitStatus && (
        <div className={`mt-4 p-3 rounded ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default Form;