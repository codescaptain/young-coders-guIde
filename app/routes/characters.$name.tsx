import type { MetaFunction, LoaderFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import youngCodersGuide from "~/data/young_coders_guide.json";

export const meta: MetaFunction = ({ data }) => {
    return [
        { title: `${data.character.name} - Tech Character` },
        { name: "description", content: data.character.description },
    ];
};

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: "/styles/character.css" },
    { rel: "stylesheet", href: "/styles/main.css" }
];

export const loader: LoaderFunction = async ({ params }) => {
    const characterName = params.name.replace("-", " ");
    const chapter = youngCodersGuide.chapters.find(
        ch => ch.character.name.toLowerCase() === characterName
    );

    if (!chapter) {
        throw new Response("Not Found", { status: 404 });
    }

    return json(chapter);
};

export default function Character() {
    const chapter = useLoaderData<typeof loader>();
    const { character } = chapter;
    const [activeTermIndex, setActiveTermIndex] = useState<number | null>(null);
    const [isWaving, setIsWaving] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<Array<{
        question: string;
        correctAnswer: string;
        incorrectAnswers: string[];
    }>>([]);
    const [certificateEarned, setCertificateEarned] = useState(false);
    const [showNameInput, setShowNameInput] = useState(false);
    const [userName, setUserName] = useState("");
    const certificateRef = useRef(null);

    const totalQuestions = 1;
    const passingScore = Math.ceil(totalQuestions * 0.7);

    useEffect(() => {
        if (showResult && score >= passingScore) {
            import('canvas-confetti').then(confetti => {
                confetti.default({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            });
        }
    }, [showResult, score]);

    const handleTermClick = (index: number) => {
        setActiveTermIndex(activeTermIndex === index ? null : index);
    };

    const handleWave = () => {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1000);
    };

    const generateQuizQuestions = () => {
        const shuffledTerms = [...character.terms].sort(() => 0.5 - Math.random());
        const selectedTerms = shuffledTerms.slice(0, totalQuestions);
        
        const questions = selectedTerms.map(term => ({
            question: `What does ${term.term} mean?`,
            correctAnswer: term.description,
            incorrectAnswers: shuffledTerms
                .filter(t => t !== term)
                .slice(0, 3)
                .map(t => t.description)
        }));

        setQuizQuestions(questions);
    };

    const startQuiz = () => {
        generateQuizQuestions();
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setCertificateEarned(false);
        setUserName("");
    };

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) setScore(score + 1);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResult(true);
            if (score + (isCorrect ? 1 : 0) >= passingScore) {
                setShowNameInput(true);
            }
        }
    };

    const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowNameInput(false);
        setCertificateEarned(true);
        generateCertificate();
    };

    const generateCertificate = async () => {
        if (certificateRef.current) {
            const { jsPDF } = await import('jspdf');
            const html2canvas = (await import('html2canvas')).default;
            
            const canvas = await html2canvas(certificateRef.current);
            const imgData = canvas.toDataURL('image/png');
            
            // A4 boyutları: 210mm x 297mm
            const pdfWidth = 210;
            const pdfHeight = 297;
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${userName}_${character.name}_Certificate.pdf`);
        }
    };

    const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;

    return (
        <div className="main character-page">
            <div className="container">
                <div className="character-header">
                    <div className={`character-image ${isWaving ? 'waving' : ''}`}>
                        <img
                            src={`/images/${chapter.character_image_prefix}.png`}
                            alt={`${character.name} character`}
                        />
                    </div>
                    <div className="character-intro">
                        <h1>{character.name}</h1>
                        <p className="greet-message">{character.greet_message}</p>
                        <button className="wave-button" onClick={handleWave}>Wave to {character.name.split(' ')[0]}!</button>
                    </div>
                </div>
                <p className="character-description">{character.description}</p>
                <div className="terms-container">
                    <h2>Key Terms:</h2>
                    <ul className="terms-list">
                        {character.terms.map((term, index) => (
                            <li
                                key={index}
                                className={`term-item ${activeTermIndex === index ? 'active' : ''}`}
                                onClick={() => handleTermClick(index)}
                            >
                                <strong>{term.term}</strong>
                                {activeTermIndex === index && <p>{term.description}</p>}
                            </li>
                        ))}
                    </ul>
                </div>

                {!quizStarted && (
                    <div className="quiz-buttons">
                        <button className="quiz-button" onClick={startQuiz}>Start Quiz!</button>
                    </div>
                )}

                {quizStarted && !showResult && (
                    <div className="quiz-container">
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar" 
                                style={{width: `${progressPercentage}%`}}
                            ></div>
                        </div>
                        <p className="question-counter">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                        <h3>{quizQuestions[currentQuestionIndex].question}</h3>
                        <div className="quiz-options">
                            {[quizQuestions[currentQuestionIndex].correctAnswer,
                            ...quizQuestions[currentQuestionIndex].incorrectAnswers]
                                .sort(() => Math.random() - 0.5)
                                .map((answer, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(answer === quizQuestions[currentQuestionIndex].correctAnswer)}
                                    >
                                        {answer}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}

                {showNameInput && (
                    <div className="name-input-popup">
                        <form onSubmit={handleNameSubmit}>
                            <h3>Congratulations! You've earned a certificate!</h3>
                            <p>Please enter your name to generate your certificate:</p>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Your Full Name"
                                required
                            />
                            <button type="submit">Generate Certificate</button>
                        </form>
                    </div>
                )}

                {showResult && (
                    <div className="quiz-result">
                        <h3>Quiz Complete!</h3>
                        <p>You scored {score} out of {totalQuestions}!</p>
                        {certificateEarned ? (
                            <div className="certificate" ref={certificateRef}>
                                <img 
                                    src={`/images/${chapter.character_image_prefix}.png`} 
                                    alt={`${character.name} character`}
                                    className="certificate-character-image"
                                />
                                <h2>Certificate of Achievement</h2>
                                <p>This certifies that</p>
                                <h3>{userName}</h3>
                                <p>has successfully completed the</p>
                                <h3>{character.name} Tech Challenge</h3>
                                <p>in the Young Coder's Guide program</p>
                                <p>Date: {new Date().toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <p>You need at least {passingScore} correct answers to earn the certificate. Keep trying!</p>
                        )}
                        {certificateEarned && (
                            <button className="quiz-button" onClick={generateCertificate}>Download Certificate</button>
                        )}
                        <br/>
                        <button onClick={startQuiz}>Try Again</button>
                    </div>
                )}

                <div className="back-button-container">
                    <Link to="/" className="back-button">Back to Characters</Link>
                </div>
            </div>
        </div>
    );
}