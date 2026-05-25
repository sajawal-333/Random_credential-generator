import React, { useState, useCallback } from 'react';
import { uniqueNamesGenerator, adjectives, animals, colors } from 'unique-names-generator';
import { Copy, RefreshCw, Check, Shield, User } from 'lucide-react';
import './index.css';

const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let password = '';
  // Generate a random 16 character password
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const generateUsername = () => {
  // Generate a nice random username using colors, adjectives and animals
  const baseName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '',
    style: 'capital'
  });
  // Append a random number to make it more realistic
  return baseName + Math.floor(Math.random() * 100);
};

const generateCredentials = (count = 100) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    username: generateUsername(),
    password: generatePassword(),
  }));
};

function App() {
  const [credentials, setCredentials] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedType, setCopiedType] = useState(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Add a tiny delay to allow UI to show spinning state and to make it feel like "work" is happening
    setTimeout(() => {
      setCredentials(generateCredentials(100));
      setIsGenerating(false);
    }, 300);
  };

  const copyToClipboard = useCallback((text, id, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setCopiedType(type);
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    });
  }, []);

  const handleCopyAll = () => {
    const textToCopy = credentials.map(c => `Username: ${c.username} | Password: ${c.password}`).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId('all');
      setCopiedType('all');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">CredGen Pro</h1>
        <p className="subtitle">
          Generate high-security, unique username and password combinations instantly.
        </p>
      </div>

      <div className="action-buttons">
        <button 
          className={`generate-btn ${isGenerating ? 'generating' : ''}`} 
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <RefreshCw className="icon" size={24} />
          {isGenerating ? 'Generating...' : 'Generate 100 Credentials'}
        </button>

        {credentials.length > 0 && (
          <button 
            className={`generate-btn secondary-btn ${copiedId === 'all' ? 'success' : ''}`} 
            onClick={handleCopyAll}
          >
            {copiedId === 'all' ? <Check className="icon" size={24} /> : <Copy className="icon" size={24} />}
            {copiedId === 'all' ? 'Copied All!' : 'Copy All'}
          </button>
        )}
      </div>

      {credentials.length > 0 && (
        <div className="grid">
          {credentials.map((cred, index) => (
            <div 
              className="card" 
              key={cred.id}
              style={{ animationDelay: `${(index % 10) * 0.05}s` }}
            >
              <div className="card-header">
                <span className="card-index">#{cred.id.toString().padStart(3, '0')}</span>
              </div>
              
              <div className="field">
                <div className="field-label">
                  <User size={14} /> Username
                </div>
                <div className="field-value-wrapper">
                  <span className="field-value">{cred.username}</span>
                  <button 
                    className={`copy-btn ${copiedId === cred.id && copiedType === 'user' ? 'success' : ''}`}
                    onClick={() => copyToClipboard(cred.username, cred.id, 'user')}
                    title="Copy Username"
                  >
                    {copiedId === cred.id && copiedType === 'user' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  <Shield size={14} /> Password
                </div>
                <div className="field-value-wrapper">
                  <span className="field-value">{cred.password}</span>
                  <button 
                    className={`copy-btn ${copiedId === cred.id && copiedType === 'pass' ? 'success' : ''}`}
                    onClick={() => copyToClipboard(cred.password, cred.id, 'pass')}
                    title="Copy Password"
                  >
                    {copiedId === cred.id && copiedType === 'pass' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
