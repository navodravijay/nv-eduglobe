import { useRef, useState } from 'react'
import { ArrowRight, Check, Compass, RotateCcw, Sparkles, Trophy, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { questions, scoreQuiz } from '../data/quiz'

export function Quiz() {
  const { language, t } = useLanguage()
  const [step, setStep] = useState<'intro' | 'question' | 'result'>('intro')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [checked, setChecked] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const question = questions[index]
  function start() {
    setStep('question')
    setIndex(0)
    setSelected(null)
    setAnswers([])
    setChecked(false)
    requestAnimationFrame(() => heading.current?.focus())
  }
  function check() {
    if (selected === null || checked) return
    setAnswers((values) => {
      const next = [...values]
      next[index] = selected
      return next
    })
    setChecked(true)
  }
  function next() {
    if (!checked) return
    if (index === questions.length - 1) setStep('result')
    else {
      setIndex((value) => value + 1)
      setSelected(null)
      setChecked(false)
    }
    requestAnimationFrame(() => heading.current?.focus())
  }
  if (step === 'intro')
    return (
      <div className="quiz-intro">
        <div className="quiz-orbit" aria-hidden="true">
          <Compass size={66} strokeWidth={0.7} />
          <span className="orbit-dot" />
        </div>
        <span className="eyebrow">10 {t.question.toLocaleLowerCase()} · EN / සිං</span>
        <h3>{t.quizTitle}</h3>
        <p>{t.quizDescription}</p>
        <button className="button primary" onClick={start}>
          {t.startQuiz}
          <ArrowRight size={17} />
        </button>
        <p className="fine-print">{t.quizNote}</p>
      </div>
    )
  if (step === 'result')
    return (
      <div className="quiz-result">
        <Trophy size={45} strokeWidth={1} />
        <span className="eyebrow">{t.score}</span>
        <div className="score-value">
          {scoreQuiz(answers)}
          <span>/ {questions.length}</span>
        </div>
        <h3 ref={heading} tabIndex={-1}>
          {t.resultTitle}
        </h3>
        <p>{t.resultDescription}</p>
        <div className="result-dots" aria-label={`${scoreQuiz(answers)} / ${questions.length}`}>
          {questions.map((item, i) => (
            <span key={i} className={answers[i] === item.correct ? 'right' : 'wrong'}>
              {answers[i] === item.correct ? <Check size={14} /> : <X size={14} />}
            </span>
          ))}
        </div>
        <button className="button primary" onClick={start}>
          <RotateCcw size={16} />
          {t.restart}
        </button>
      </div>
    )
  return (
    <div className="quiz-question">
      <div className="quiz-topline">
        <span className="eyebrow">
          {t.question} {String(index + 1).padStart(2, '0')} {t.of} {questions.length}
        </span>
        <Sparkles size={19} />
      </div>
      <div
        className="quiz-progress"
        role="progressbar"
        aria-label={t.question}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={index + 1}
      >
        <span style={{ width: `${(index + 1) * 10}%` }} />
      </div>
      <h3 ref={heading} tabIndex={-1}>
        {question.question[language]}
      </h3>
      <fieldset className="quiz-options" disabled={checked}>
        <legend className="sr-only">{question.question[language]}</legend>
        {question.options.map((option, i) => (
          <label
            key={i}
            className={`quiz-option ${selected === i ? 'selected' : ''} ${checked && i === question.correct ? 'correct-option' : ''} ${checked && selected === i && i !== question.correct ? 'wrong-option' : ''}`}
          >
            <input
              type="radio"
              name={`answer-${index}`}
              checked={selected === i}
              onChange={() => setSelected(i)}
              value={i}
            />
            <span className="option-letter">{String.fromCharCode(65 + i)}</span>
            <span>{option[language]}</span>
            {checked && i === question.correct && <Check size={18} />}
            {checked && selected === i && i !== question.correct && <X size={18} />}
          </label>
        ))}
      </fieldset>
      {checked && (
        <div
          className={`quiz-feedback ${selected === question.correct ? 'success' : ''}`}
          role="status"
        >
          <strong>{selected === question.correct ? t.correct : t.incorrect}</strong>
          <p>{question.explanation[language]}</p>
        </div>
      )}
      <div className="quiz-actions">
        {checked ? (
          <button className="button primary" onClick={next}>
            {index === 9 ? t.seeScore : t.nextQuestion}
            <ArrowRight size={16} />
          </button>
        ) : (
          <button className="button primary" disabled={selected === null} onClick={check}>
            {t.checkAnswer}
            <ArrowRight size={16} />
          </button>
        )}
        <span className="fine-print">{t.quizNote}</span>
      </div>
    </div>
  )
}
