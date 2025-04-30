import { useState, useEffect } from 'react';
import '../styles/pages/upload.scss';

interface ParentWindow extends Window {
  handleUpload?: (searchParams: string) => void;
  appsData?: {
    sendLiveImage?: (data: any[]) => void;
  };
}

interface UploadProps {
  isBulk?: boolean;
  onUploadComplete?: (fileName: string) => void;
}

const Upload: React.FC<UploadProps> = ({ isBulk = false, onUploadComplete }) => {
  const [isPhotoActive, setIsPhotoActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success') === 'true';
    const hasParent = window.parent !== window;
    const parentWindow = window.parent as ParentWindow;

    if (success && hasParent) {
      if (parentWindow.handleUpload) {
        parentWindow.handleUpload(window.location.search);
      } else if (onUploadComplete) {
        const fileName = params.get('name');
        if (fileName) {
          onUploadComplete(fileName);
        }
      }
    }
  }, [onUploadComplete]);

  const handlePhotoClick = () => {
    setIsPhotoActive(!isPhotoActive);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/uploadFile', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        
        if (window.parent !== window) {
          const parentWindow = window.parent as ParentWindow;
          if (parentWindow.handleUpload) {
            parentWindow.handleUpload(window.location.search);
          } else if (parentWindow.appsData?.sendLiveImage) {
            parentWindow.appsData.sendLiveImage([data]);
          }
        } else if (onUploadComplete) {
          onUploadComplete(data.name);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      {!isBulk && <h1>Upload a File</h1>}
      {!isBulk && (
        <button 
          className="photo" 
          onClick={handlePhotoClick}
          title="Take Photo"
        >
          Take a Photo
        </button>
      )}
      <div className={`iframe-area photo ${isPhotoActive ? 'active' : ''}`}>
        <iframe 
          src={isPhotoActive ? '/photo/take' : ''} 
          title="Take Photo"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="myfile">Upload File:</label>
        <input 
          id="myfile" 
          type="file" 
          name="image" 
          required 
          accept=".jpeg, .jpg, image/png, image/webp, image/gif" 
          onChange={handleFileChange}
        />
        <p>
          <input 
            type="submit" 
            value={isUploading ? "Uploading..." : "Submit"} 
            disabled={isUploading}
          />
        </p>
      </form>
    </div>
  );
};

export default Upload; 