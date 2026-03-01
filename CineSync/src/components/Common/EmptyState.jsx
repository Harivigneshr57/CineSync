import './emptyState.css';

export default function EmptyState({
    message = 'Nothing found',
    iconClass = 'fa-solid fa-circle-exclamation',
    className = '',
}) {
    return (
        <div className={`empty-state ${className}`.trim()}>
            <i className={`empty-state-icon ${iconClass}`}></i>
            <p className="empty-state-message">{message}</p>
        </div>
    );
}