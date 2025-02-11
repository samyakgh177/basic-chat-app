import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const [inputValue,setInputValue] = useState("");
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // Fixed protocol from https to ws
    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    }
    wsRef.current = ws;
    ws.onopen = ()=>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
    }
    return ()=>{
      ws.close()
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="m-4">
            <span className="bg-white text-black rounded-lg p-3 shadow-md">
              {msg}
            </span>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="w-full bg-gray-100 flex items-center p-4 gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg outline-none"
          onChange={e=>{setInputValue(e.target.value)}}
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        onClick={()=>{
          wsRef.current.send(JSON.stringify({
            type:"chat",
            payload:{
              message:inputValue
            }
          }))
        }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;