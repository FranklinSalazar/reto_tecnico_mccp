import { useState } from "react";

export default function MessageForm({ messages, onSend }) {

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [channels, setChannels] = useState({
        email: false,
        slack: false,
        sms: false
    });

    const getChannelStatus = (message, channel) => {
        if (!message.delivery_logs) return "—";

        const log = message.delivery_logs.find(l => l.channel === channel);
        return log ? log.status : "—";
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const selected = Object.keys(channels).filter(c => channels[c]);

        if (!title || !content || selected.length === 0) {
        alert("Completa todos los campos");
        return;
        }

        onSend({
            title,
            content,
            channels: selected
        });

        setTitle("");
        setContent("");
        setChannels({ email: false, slack: false, sms: false });
        setIsOpen(false);
    };

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setChannels(prev => ({ ...prev, [name]: checked }));
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "pendiente":
            return {
                background: "#fef3c7",
                color: "#92400e"
            };
            case "procesado":
            return {
                background: "#dcfce7",
                color: "#166534"
            };
            case "fallido":
            return {
                background: "#fee2e2",
                color: "#991b1b"
            };
            case "exito":
            return {
                background: "#dcfce7",
                color: "#374151"
            };
            default:
            return {
                background: "#f3f4f6",
                color: "#374151"
            };
        }
    };

    return (
        <div style={styles.wrapper}>

        <div style={styles.header}>
            <div>
            <h1 style={styles.mainTitle}>MCCP Dashboard</h1>
            <p style={styles.subtitle}>Gestión y distribución multi-canal</p>
            </div>

            <button style={styles.primaryBtn} onClick={() => setIsOpen(true)}>
                + Nuevo Mensaje
            </button>
        </div>

        <div style={styles.card}>
            {messages.length === 0 ? (
            <div style={styles.emptyState}>
                <h3>Sin mensajes aún</h3>
                <p>Cuando envíes contenido aparecerá aquí.</p>
            </div>
            ) : (
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Título</th>
                        <th style={styles.th}>Sumarry</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Slack</th>
                        <th style={styles.th}>SMS</th>
                        <th style={styles.th}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map(msg => (
                        <tr key={msg.id} style={styles.tr}>
                            <td style={styles.td}>
                                <strong>{formatDateTime(msg.created_at)}</strong>
                            </td>

                            <td style={styles.td}>
                                <strong>{msg.title}</strong>
                                <div style={styles.preview}>
                                    {msg.original_content}
                                </div>
                            </td>
                            
                            <td style={styles.td}>
                                <div style={styles.preview}>
                                    {msg.summary}
                                </div>
                            </td>

                            <td style={styles.td}>
                                <span style={{...styles.statusBadge,...getStatusStyle(getChannelStatus(msg, "email"))}}>
                                    {getChannelStatus(msg, "email")}
                                </span>
                            </td>

                            <td style={styles.td}>
                                <span style={{...styles.statusBadge,...getStatusStyle(getChannelStatus(msg, "slack"))}}>
                                    {getChannelStatus(msg, "slack")}
                                </span>
                            </td>

                            <td style={styles.td}>
                                <span style={{...styles.statusBadge,...getStatusStyle(getChannelStatus(msg, "sms"))}}>
                                    {getChannelStatus(msg, "sms")}
                                </span>
                            </td>

                            <td style={styles.td}>
                                <span style={{...styles.statusBadge, ...getStatusStyle(msg.status)}}>
                                    {msg.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>

        {isOpen && (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    <div style={styles.modalHeader}>
                        <h2>Nuevo Mensaje</h2>
                        <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label style={styles.label}>Título</label>
                        <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Ingrese su descripcion"/>

                        <label style={styles.label}>Contenido</label>
                        <textarea style={styles.textarea} value={content} onChange={e => setContent(e.target.value)} rows={5} placeholder="Escribe el contenido aquí..."/>

                        <label style={styles.label}>Canales</label>
                        <div style={styles.checkboxGroup}>
                            {["email", "slack", "sms"].map(c => (
                                <label key={c} style={styles.checkboxCard}>
                                    <input type="checkbox" name={c} checked={channels[c]} onChange={handleCheck} />
                                    {c.toUpperCase()}
                                </label>
                            ))}
                        </div>

                        <button type="submit" style={styles.submitBtn}>
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
            </div>
        )}
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "60px 80px",
        fontFamily: "Inter, sans-serif"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px"
    },

    mainTitle: {
        margin: 0,
        fontSize: "28px"
    },

    subtitle: {
        margin: 0,
        color: "#6b7280"
    },

    primaryBtn: {
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "12px 22px",
        borderRadius: "10px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "0.2s",
    },

    card: {
        background: "#fff",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    th: {
        textAlign: "left",
        padding: "12px",
        color: "#6b7280",
        fontSize: "14px"
    },

    tr: {
        borderTop: "1px solid #eee"
    },

    td: {
        padding: "16px"
    },

    preview: {
        fontSize: "12px",
        color: "#9ca3af",
        marginTop: "4px"
    },

    badge: {
        background: "#e0e7ff",
        color: "#3730a3",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        marginRight: "5px"
    },

    statusBadge: {
        padding: "6px 14px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        display: "inline-block",
        letterSpacing: "0.3px"
    },

    emptyState: {
        textAlign: "center",
        padding: "60px",
        color: "#9ca3af"
    },

    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(4px)"
    },

    modal: {
        background: "#fff",
        padding: "40px",
        borderRadius: "20px",
        width: "500px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
    },

    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },

    closeBtn: {
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer"
    },

    label: {
        display: "block",
        marginBottom: "6px",
        marginTop: "15px",
        fontWeight: 500
    },

    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd"
    },

    textarea: {
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd"
    },

    checkboxGroup: {
        display: "flex",
        gap: "15px",
        marginBottom: "20px"
    },

    checkboxCard: {
        background: "#f3f4f6",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer"
    },

    submitBtn: {
        width: "100%",
        marginTop: "20px",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: "#2563eb",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer"
    }
};