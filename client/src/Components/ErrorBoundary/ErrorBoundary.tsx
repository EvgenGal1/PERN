// ^ перехвата ошб.в дочер.Комп., предотвращает "падение" всего приложения. Показ резервный польз.интерфейс (fallback UI) и логировать ошб.

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode; // вложен.дочер.Комп.
  fallback?: ReactNode; // возможность передать собственный fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // перехват ошб.в дочер.Комп.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("ErrorBoundary обнаружил ошибку:", error);
    return { hasError: true, error };
  }

  // логирование ошб. > аналитики
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Подробности ошибки:", error, errorInfo);

    // мжн.добав.интеграцию с Sentry > лог.ошб.
    // Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    // при ошб.отображ. переданный UI`резерв` или дефолтный
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Упс! Что-то пошло не так.</h1>
            <p>Попробуйте обновить страницу или зайдите позже.</p>
          </div>
        )
      );
    }
    // без ошб.отраж.дочер.эл.
    return this.props.children;
  }
}

export default ErrorBoundary;
