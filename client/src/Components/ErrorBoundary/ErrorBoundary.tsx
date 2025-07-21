// ^ перехватчик ошб.в дочер.Комп.(заглушка(fallback UI) от ошб.рендер, логировать ошб.)

import React, { Component, ReactNode } from "react";
// import * as Sentry from "@sentry/react";

// клс.обраб.ошб.
import { ApiError } from "@/utils/errorAPI";

interface ErrorBoundaryProps {
  children: ReactNode; // вложен.дочер.Комп.
  //  передача отката UI
  fallback?: React.ReactElement<{ error: ApiError; onReset: () => void }>;
}

export type FallbackComp = React.ComponentType<{
  error: ApiError;
  onReset: () => void;
}>;

interface ErrorBoundaryState {
  error: ApiError | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComp?: FallbackComp;
}

// дефолтный UI для отображ./обраб.ошб.
const DefaultFallback = ({
  error,
  onReset,
}: {
  error: ApiError;
  onReset: () => void;
}) => (
  <div
    className="error-boundary error-fallback"
    style={{ textAlign: "center", marginTop: "50px" }}
  >
    <h1>⚠️ Что-то пошло не так</h1>
    <p className="error-message">{error.message}</p>
    {error.code && <p className="error-code">Код: {error.code}</p>}
    <button className="retry-button" onClick={onReset}>
      Попробовать снова
    </button>
  </div>
);

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  // перехват ошб.в дочер.Комп.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // логгирование
    console.error("ErrorBoundary ОШБ: ", error);
    // Sentry.captureException(error);
    return {
      error: new ApiError(500, error.message, "COMPONENT_ERROR", {
        stack: error.stack,
      }),
    };
  }

  // логирование ошб. > аналитики
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Подробности ошибки:", error, errorInfo);
    // лог.ошб. Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }

  // сброс сост.после ошб.
  handleReset = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    const { FallbackComp, children } = this.props;

    // при ошб.отображ. переданный UI`резерв` или дефолтный
    if (error) {
      return FallbackComp ? (
        <FallbackComp error={error} onReset={this.handleReset} />
      ) : (
        <DefaultFallback error={error} onReset={this.handleReset} />
      );
    }
    // без ошб.отраж.дочер.эл.
    return children;
  }
}

export default ErrorBoundary;
