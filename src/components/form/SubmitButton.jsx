const SubmitButton = ({ isSubmitting }) => (
  <button
    type="submit"
    className={`w-56 text-white bg-primary px-4 py-2 rounded-xl cursor-pointer  mt-5 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Enviando...' : 'Enviar'}
  </button>
);

export default SubmitButton;
