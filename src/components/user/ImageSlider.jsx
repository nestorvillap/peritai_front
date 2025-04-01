const ImageSlider = ({ danios_detectados, currentIndex, setCurrentIndex }) => {
    const goToPrevious = () => setCurrentIndex(prev => prev === 0 ? danios_detectados.length - 1 : prev - 1);
    const goToNext = () => setCurrentIndex(prev => prev === danios_detectados.length - 1 ? 0 : prev + 1);

    return (
        <div className="relative">
            <div className="flex items-center justify-between">
                <button onClick={goToPrevious} className="cursor-pointer bg-primary text-white p-2 rounded-full mr-4">←</button>
                <img 
                    src={danios_detectados[currentIndex].url_image} 
                    alt={`Vista ${danios_detectados[currentIndex].tipo_imagen}`}
                    className="w-full h-64 object-cover rounded-lg"
                />
                <button onClick={goToNext} className="cursor-pointer bg-primary text-white p-2 rounded-full ml-4">→</button>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
                {danios_detectados.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 w-2 rounded-full cursor-pointer ${index === currentIndex ? 'bg-primary' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
