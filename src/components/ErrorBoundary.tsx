import { Component } from 'react'
import type { ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: boolean }
> {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  render() {
    if (this.state.error)
      return (
        this.props.fallback ?? (
          <main className="fatal-error">
            <span className="brand-monogram">NV.</span>
            <h1>A small detour. / කුඩා බාධාවක්.</h1>
            <p>Please reload the experience. / කරුණාකර පිටුව නැවත පූරණය කරන්න.</p>
            <button className="button primary" onClick={() => window.location.reload()}>
              Reload / නැවත පූරණය කරන්න
            </button>
          </main>
        )
      )
    return this.props.children
  }
}
