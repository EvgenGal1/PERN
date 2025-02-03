// ^ перехвата ошб.в дочер.Комп., предотвращает "падение" всего приложения. Показ резервный польз.интерфейс (fallback UI) и логировать ошб.

import React, { Component, ReactNode } from "react";
// import * as Sentry from "@sentry/react";

interface ErrorBoundaryProps {
  children: ReactNode; // вложен.дочер.Комп.
  fallback?: ReactNode; // передача отката UI
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: ErrorRes | null;
}

export interface ErrorRes {
  status?: number;
  message?: string;
  errors?: Record<string, unknown>;
  code?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // перехват ошб.в дочер.Комп.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("ErrorBoundary ОШБ: ", error);
    // логгирование
    // Sentry.captureException(error);
    return {
      hasError: true,
      error: {
        status: 500,
        message: error.message,
        code: "COMPONENT_ERROR",
      },
    };
  }

  // логирование ошб. > аналитики
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Подробности ошибки:", error, errorInfo);
    // мжн.добав.интеграцию с Sentry > лог.ошб.
    // Sentry.captureException(error, { extra: errorInfo });
  }

  // сброс сост.после ошб.
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    // при ошб.отображ. переданный UI`резерв` или дефолтный
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className="error-boundary"
            style={{ textAlign: "center", marginTop: "50px" }}
          >
            <h1>⚠️ Упс! Что-то пошло не так.</h1>
            <p>{this.state.error?.message}</p>
            {this.state.error?.code && (
              <p>Код ошибки: {this.state.error.code}</p>
            )}
            {/* ручной сброс ошб. */}
            <button onClick={this.handleReset}>Попробовать снова</button>
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
