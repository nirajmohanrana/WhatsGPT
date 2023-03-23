import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_Key = "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";

function App() {
  const [tpying, setTyping] = useState(false);

  const [sysContent, setSysContent] = useState(
    "Explain all concept like I am 10 year old"
  );

  const [messages, setMessages] = useState([
    {
      message: "Hello! I am WhatsGPT",
      sender: "WhatsGPT",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: sysContent,
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_Key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <div className="App">
      <div className="ChatDiv">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                tpying ? <TypingIndicator content="WhatsGPT is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Type your message here"
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
      <div className="sysType">
        <button
          onClick={() => {
            setSysContent("Explain all concept like I am 10 year old");
          }}
        >
          I am 10 Year Old
        </button>
        <button
          onClick={() => {
            setSysContent("Speak like a pirate");
          }}
        >
          I am a Pirate Captain
        </button>
        <button
          onClick={() => {
            setSysContent(
              "Explain all concept like I have 5 years of experience"
            );
          }}
        >
          I am an Experienced Engineer
        </button>
      </div>
    </div>
  );
}

export default App;
