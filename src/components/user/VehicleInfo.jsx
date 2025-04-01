import { IconRefresh } from '@tabler/icons-preact';

const VehicleInfo = ({ datos_vehiculo }) => (
    <section className="max-w-4xl mx-auto flex gap-4 justify-between mt-20   px-4 py-2 rounded-md">
        <div className="flex flex-col">
            <h1 className="font-bold text-2xl">Matrícula</h1>
            <p className="text-xl">{datos_vehiculo.matricula}</p>
        </div>
        <div className="flex flex-col">
            <h1 className="font-bold text-2xl">Modelo</h1>
            <p className="text-xl">{datos_vehiculo.modelo}</p>
        </div>
        <div className="flex flex-col">
            <h1 className="font-bold text-2xl">Año</h1>
            <p className="text-xl">{datos_vehiculo.anio}</p>
        </div>
        <div className="flex flex-col">
            <h1 className="font-bold text-2xl">Estado</h1>
            <p className="text-xl">Procesando</p>
        </div>
        <button 
            onClick={() => window.location.reload()}
            className="mt-4 cursor-pointer px-4 py-2 rounded-md transition-colors flex"
        >
            <IconRefresh />
        </button>
    </section>
);

export default VehicleInfo;
