import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-blue-700">Interest | Aptitude Test</h1>
                    <p className="mt-4 text-lg text-gray-700">Q6. Do you like finding spelling mistakes and grammatical errors in your workbook?</p>
                </div>
                <div className="space-y-4">
                    <label className="block">
                        <input type="radio" name="preference" value="Strongly Dislike" className="mr-2" />
                        Strongly Dislike
                    </label>
                    <label className="block">
                        <input type="radio" name="preference" value="Dislike" className="mr-2" />
                        Dislike
                    </label>
                    <label className="block">
                        <input type="radio" name="preference" value="Unsure" className="mr-2" />
                        Unsure
                    </label>
                    <label className="block">
                        <input type="radio" name="preference" value="Like" className="mr-2" />
                        Like
                    </label>
                    <label className="block">
                        <input type="radio" name="preference" value="Strongly Like" className="mr-2" />
                        Strongly Like
                    </label>
                </div>
                <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">Next</button>
                <div className="mt-6 flex justify-between items-center">
                    <div className="flex space-x-2">
                        {[...Array(5)].map((_, i) => (
                            <button key={i} className={`w-10 h-10 rounded-full border ${i === 5 - 1 ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-gray-600">Need help?</div>
                </div>
                <div className="mt-2 text-center text-gray-500">06/20</div>
                <div className="mt-2 text-center text-gray-500">15:50</div>
            </div>
        </div>
    );
};

export default Home;
