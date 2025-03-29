import { useState, useRef } from 'preact/hooks';




const Form = () => {
  const [formData, setFormData] = useState({
    plate: '',
    carModel: '',
    year: '',
    carImages: {
      frontal: null,
      trasera: null,
      lateral_izquierdo: null,
      lateral_derecho: null
    }
  });
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith('car-image-')) {
      const imageType = name.replace('car-image-', '');
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

  const handleClick = () => {
    fileInputRef.current?.click();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('plate', formData.plate);
      formDataToSend.append('carModel', formData.carModel);
      formDataToSend.append('year', formData.year);

      // Adjuntar cada imagen con su tipo
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
          trasera: null,
          lateral_izquierdo: null,
          lateral_derecho: null
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto justify-between mt-20 flex items-center flex-col">
      <div className="flex-col flex">
        <div className="flex justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold">Rellana los datos de tu coche:</h2>
            <input
              type="text"
              name="plate"
              placeholder="Matricula"
              className="border-2 px-4 py-2 rounded-sm"
              value={formData.plate}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="carModel"
              placeholder="Modelo de coche"
              className="border-2 px-4 py-2 rounded-sm"
              value={formData.carModel}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="year"
              placeholder="Año"
              className="border-2 px-4 py-2 rounded-sm"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-bold">Sube las fotos de tu coche:</h2>
            <div className="grid grid-cols gap-4">
              <div className="relative w-full group" onClick={handleClick}>
                <div className="grid grid-cols2 gap-4">
                  <div className="flex items-center justify-between ">
                    <label>Frontal: </label>
                    <input
                      type="file"
                      name="car-image-frontal"
                      accept="image/*"
                      className="border-2 px-4 py-2 rounded-sm cursor-pointer hover:scale-105 transition-all"
                      onChange={handleChange}
                      required

                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label>Trasera: </label>
                <input
                  type="file"
                  name="car-image-parte trasera"
                  accept="image/*"
                  className="border-2 px-4 py-2 rounded-sm cursor-pointer hover:scale-105 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label>Lateral Izquierdo: </label>
                <input
                  type="file"
                  name="car-image-lateral izquierdo"
                  accept="image/*"
                  className="border-2 px-4 py-2 rounded-sm cursor-pointer hover:scale-105 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Lateral Derecho: </label>
                <input
                  type="file"
                  name="car-image-lateral derecho"
                  accept="image/*"
                  className="border-2 px-4 py-2 rounded-sm cursor-pointer hover:scale-105 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {submitStatus && (
        <div className={`mt-4 p-3 rounded ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}

      <button
        type="submit"
        className={`w-56 border-2 px-4 py-2 rounded-xl cursor-pointer hover:bg-black hover:text-white mt-5 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default Form;