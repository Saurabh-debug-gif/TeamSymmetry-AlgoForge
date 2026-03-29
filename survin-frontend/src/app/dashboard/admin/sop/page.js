"use client";

import { useState } from "react";

export default function SopUploadPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            alert("Select PDF first");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8000/api/ai/process-sop?num_questions=10", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            setResult(data);

        } catch (err) {
            console.error(err);
            alert("Error processing SOP");
        }

        setLoading(false);
    };

    return (
        <div style={{ color: "#fff" }}>
            <h2>SOP Processor</h2>

            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <br /><br />

            <button onClick={handleUpload}>
                {loading ? "Processing..." : "Upload & Process"}
            </button>

            {result && (
                <div style={{ marginTop: "2rem" }}>
                    <h3>📄 File: {result.filename}</h3>
                    <p>Word Count: {result.word_count}</p>

                    <h3>🧠 Training Content</h3>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {result.training_content}
                    </pre>

                    <h3>❓ Quiz</h3>
                    <ul>
                        {result.quiz?.map((q, i) => (
                            <li key={i}>
                                <strong>{q.question}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}