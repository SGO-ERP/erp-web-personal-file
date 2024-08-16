import React, { Component } from 'react';
import InternalServerError from '../../errorPage/InternalServerError';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Обновляем состояние, чтобы показать ошибку пользователю
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Можно добавить логирование ошибки
        console.log('Ошибка:', error);
        console.log('Информация об ошибке:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Здесь вы можете отобразить резервный интерфейс или сообщение об ошибке
            return <InternalServerError />;
        }

        // Если ошибок нет, рендерим дочерние компоненты
        return this.props.children;
    }
}

export default ErrorBoundary;
