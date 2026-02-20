import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config/api";  
import MessageForm from "./MessageForm";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error cargando mensajes:", error);
    }
  };

  const handleSend = async (payload) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/messages`,
        {
          title: payload.title,
          original_content: payload.content,
          channels: payload.channels
        }
      );

      // Agregamos el nuevo mensaje al inicio
      setMessages(prev => [
        response.data.data,
        ...prev
      ]);

    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Error enviando mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div style={{position: "fixed",top: 0,left: 0,right: 0,background: "#2563eb",color: "white",padding: "10px",textAlign: "center"}}>
          Procesando mensaje...
        </div>
      )}

      <MessageForm messages={messages} onSend={handleSend}/>

    </>
  );
}

export default App;