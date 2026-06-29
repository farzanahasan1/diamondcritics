'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Something went wrong.'
    return { hasError: true, message }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '12px',
          padding: '24px', textAlign: 'center', margin: '16px 0',
        }}>
          <p style={{ fontWeight: 700, color: '#9A3412', marginBottom: '6px', fontSize: '14px' }}>
            Something went wrong
          </p>
          <p style={{ fontSize: '13px', color: '#7C2D12', marginBottom: '14px' }}>
            {this.state.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            style={{
              padding: '7px 20px', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(145deg, #D4A843, #B8881E)',
              color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
