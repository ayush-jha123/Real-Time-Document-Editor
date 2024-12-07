import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './chat.css';

let socket;

const Work = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [content, setContent] = useState(''); // Notebook content
  const location = useLocation();
  const ENDPOINT = 'http://localhost:5000';

  // Join the room
  useEffect(() => {
    const { name, room } = queryString.parse(location?.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (err) => {
      if (err) {
        alert(err);
      }
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  // Listen for updates from the server
  useEffect(() => {
    socket.on('content', ({ content }) => {
      setContent(content); // Update local state with received content
    });

    return () => {
      socket.off('content');
    };
  }, []);

  // Emit updated content to the server
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit('updateContent', { content: newContent });
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <div className="editor">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start editing the notebook..."
            className="notebookEditor"
          />
        </div>
      </div>
    </div>
  );
};

export default Work;
