import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { questions, scoreQuiz } from '../data/quiz'
import { LanguageProvider, useLanguage } from '../context/LanguageContext'
import { Quiz } from '../components/Quiz'

function Switcher() {
  const { toggleLanguage } = useLanguage()
  return <button onClick={toggleLanguage}>Switch language</button>
}

describe('quiz scoring', () => {
  it('scores all correct, all incorrect, partial and unanswered attempts', () => {
    expect(questions).toHaveLength(10)
    expect(scoreQuiz(questions.map((question) => question.correct))).toBe(10)
    expect(scoreQuiz(questions.map((question) => (question.correct + 1) % 4))).toBe(0)
    expect(scoreQuiz([null, questions[1].correct])).toBe(1)
    expect(scoreQuiz([])).toBe(0)
  })
  it('ignores invalid, missing and extra answers', () => {
    expect(scoreQuiz([-1, 999, NaN])).toBe(0)
    expect(scoreQuiz([...questions.map((question) => question.correct), 2, 2])).toBe(10)
    expect(
      questions.every(
        (question) => question.correct >= 0 && question.correct < question.options.length,
      ),
    ).toBe(true)
  })
})

describe('quiz interaction and language switching', () => {
  it('requires an answer, explains each result, prevents duplicate submissions and restarts', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 0
    })
    render(
      <LanguageProvider>
        <Quiz />
      </LanguageProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Let’s find out/ }))
    expect(screen.getByRole('button', { name: /Check answer/ })).toBeDisabled()
    questions.forEach((question, index) => {
      fireEvent.click(
        screen.getByRole('radio', {
          name: new RegExp(
            question.options[question.correct].en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          ),
        }),
      )
      fireEvent.click(screen.getByRole('button', { name: /Check answer/ }))
      expect(screen.getByRole('status')).toHaveTextContent('That’s right!')
      expect(
        screen
          .getAllByRole('radio')
          .every(
            (input) =>
              (input as HTMLInputElement).disabled ||
              (input.closest('fieldset') as HTMLFieldSetElement).disabled,
          ),
      ).toBe(true)
      fireEvent.click(
        screen.getByRole('button', { name: index === 9 ? /See my results/ : /Next question/ }),
      )
    })
    expect(screen.getByText('10', { selector: '.score-value' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Play again/ }))
    expect(screen.getByRole('heading', { name: questions[0].question.en })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Check answer/ })).toBeDisabled()
  })
  it('switches English and Sinhala while preserving the current answer', () => {
    render(
      <LanguageProvider>
        <Switcher />
        <Quiz />
      </LanguageProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Let’s find out/ }))
    fireEvent.click(screen.getByRole('radio', { name: /Asia/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Switch language' }))
    expect(document.documentElement.lang).toBe('si')
    expect(screen.getByRole('heading', { name: questions[0].question.si })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /ආසියාව/ })).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Switch language' }))
    expect(document.documentElement.lang).toBe('en')
    expect(screen.getByRole('radio', { name: /Asia/ })).toBeChecked()
  })
})
