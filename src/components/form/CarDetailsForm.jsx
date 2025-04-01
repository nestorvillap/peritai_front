const CarDetailsForm = ({ formData, handleChange }) => (
  <div className="flex flex-col gap-4">
    <h2 className="font-bold">Rellena los datos de tu coche:</h2>
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
);

export default CarDetailsForm;
