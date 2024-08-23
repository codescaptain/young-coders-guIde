import type { MetaFunction, LoaderFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import youngCodersGuide from "~/data/young_coders_guide.json";

export const meta: MetaFunction = ({ data }) => {
    return [
        { title: `${data.character.name} - Tech Character` },
        { name: "description", content: data.character.description },
    ];
};

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: "/styles/character.css" },
    { rel: "stylesheet", href: "/styles/main.css" },
    { rel: "stylesheet", href: "/styles/puzzle.css" }
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
    const character_name = character.name.toLowerCase().replace(' ', '_');
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
    const { t } = useTranslation(['common', 'term']);

    return (
        <div className="centered">
            <div className="main character-page">
                <div className="puzzle-link-container">
                    <div className="back-button-container" style={{ marginBottom: 20 }}>
                        <Link to={`/characters/${character.name.toLowerCase().replace(" ", "-")}/puzzle`} className="back-button">
                        {t('play_puzzle_game', { name: character.name })}
                        </Link>
                    </div>
                    <Outlet />
                </div>
                <div className="container">
                    <div className="character-header">
                        <div className={`character-image ${isWaving ? 'waving' : ''}`}>
                            <img
                                src={`/images/${chapter.character_image_prefix}.png`}
                                alt={`${character.name} character`}
                            />
                        </div>
                        <div className="character-intro">
                            <h1>{t(`${character_name}.name`, { ns: 'term' })}</h1>
                            <p className="greet-message">{t(`${character_name}.greet_message`, { ns: 'term' })}</p>
                            <button className="wave-button" onClick={handleWave}>{t('character_wave', {name: character.name.split(' ')[0]})}!</button>
                        </div>
                    </div>
                    <p className="character-description">{t(`${character_name}.description`, { ns: 'term' })}</p>
                    <div className="terms-container">
                        <h2>{t('key_terms')}</h2>
                        <ul className="terms-list">
                            {character.terms.map((term, index) => (
                                <li
                                    key={index}
                                    className={`term-item ${activeTermIndex === index ? 'active' : ''}`}
                                    onClick={() => handleTermClick(index)}
                                >
                                    <strong>{t(`${character_name}.terms.${term.term_key}.term`, { ns: 'term' })}</strong>
                                    {activeTermIndex === index && <p>{t(`${character_name}.terms.${term.term_key}.description`, { ns: 'term' })}</p>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {!quizStarted && (
                        <div className="quiz-buttons">
                            <button className="quiz-button" onClick={startQuiz}>{t('start_quiz')}!</button>
                        </div>
                    )}

                    {quizStarted && !showResult && (
                        <div className="quiz-container">
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progressPercentage}%` }}
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
                                <h3>{t('success_certificate_message')}</h3>
                                <p>{t('certificate_full_name_label')}:</p>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Your Full Name"
                                    required
                                />
                                <button type="submit">{t('generate_certificate')}</button>
                            </form>
                        </div>
                    )}

                    {showResult && (
                        <div className="quiz-result">
                            <h3>{t('quiz_complete')}!</h3>
                            <p>{t('quiz_result', { score: score, totalQuestions: totalQuestions })}!</p>
                            {certificateEarned ? (
                                <div className="certificate" ref={certificateRef}>
                                    <img
                                        src={`/images/${chapter.character_image_prefix}.png`}
                                        alt={`${character.name} character`}
                                        className="certificate-character-image"
                                    />
                                    <h2>{t('certificate.title')}</h2>
                                    <p>{t('certificate.this_certifies_that')}</p>
                                    <h3>{userName}</h3>
                                    <p>{t('certificate.has_completed')}</p>
                                    <h3>{t('certificate.tech_challenge', { name: character.name })}</h3>
                                    <p>{t('certificate.in_program')}</p>
                                    <p>{t('date')}: {new Date().toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <p>{t('certificate_requirement', { passingScore: passingScore })}</p>
                            )}
                            {certificateEarned && (
                                <button className="quiz-button" onClick={generateCertificate}>{t('download_certificate')}</button>
                            )}
                            <br />
                            <button onClick={startQuiz}>{t('try_again')}</button>
                        </div>
                    )}

                    <div className="back-button-container">
                        <Link to="/" className="back-button">{t('back_to_the_characters')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}