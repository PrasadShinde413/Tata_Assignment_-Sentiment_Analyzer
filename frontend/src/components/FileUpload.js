import { useState, useRef } from 'react';
import styles from './FileUpload.module.css';
import { UploadCloud, FileText } from 'lucide-react';

export default function FileUpload({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile.type !== "text/plain" && !selectedFile.name.endsWith('.txt')) {
      alert("Please upload a valid .txt file");
      return;
    }
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      onUpload(text);
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className={styles.uploadContainer}>
      <h2 className={styles.title}>Analyze a Conversation</h2>
      <p className={styles.subtitle}>Upload a .txt transcript to extract sentiment, emotions, and KPIs.</p>
      
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          accept=".txt" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
        
        {file ? (
          <div className={styles.fileSelected}>
            <FileText size={48} className={styles.icon} />
            <p>{file.name}</p>
            <span className={styles.uploadingText}>Processing...</span>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <UploadCloud size={48} className={styles.icon} />
            <h3>Drag & Drop</h3>
            <p>or click to browse files</p>
            <span className={styles.badge}>.txt only</span>
          </div>
        )}
      </div>
    </div>
  );
}
