const FinalReviewButton = ({ allDefectsReviewed, handleFinalSubmit }) => (
    allDefectsReviewed && (
        <div className="mt-6 text-center">
            <button
                onClick={handleFinalSubmit}
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold transition-colors cursor-pointer"
            >
                Finalizar Revisión
            </button>
        </div>
    )
);

export default FinalReviewButton;
