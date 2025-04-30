import { useState, useEffect, useRef } from 'react';
import '../styles/pages/photo.scss';

interface PhotoProps {
  mode?: 'live-image' | 'default';
  onCapture?: (file: File) => void;
  onClose?: () => void;
}

const Photo: React.FC<PhotoProps> = ({ mode = 'default', onCapture, onClose }) => {
  const [isCounting, setIsCounting] = useState(false);
  const [count, setCount] = useState(3);
  const [isCaptured, setIsCaptured] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === 'live-image') {
      startCountdown();
    }

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode]);

  const startCountdown = () => {
    setIsCounting(true);
    setCount(3);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCounting(false);
          handleCapture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File(
        [blob],
        `Photo ${new Date().toISOString().replace(/:/g, '-')}.png`,
        { type: 'image/png' }
      );

      if (mode === 'live-image' && onCapture) {
        onCapture(file);
      } else {
        setIsCaptured(true);
      }
    }, 'image/png');
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `Photo ${new Date().toISOString().replace(/:/g, '-')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="photo-container">
      <div className="video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={isCaptured ? 'hidden' : 'visible'}
        />
        {isCaptured && canvasRef.current && (
          <img
            src={canvasRef.current.toDataURL('image/png')}
            alt="Captured"
            className="captured-image"
          />
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      
      {isCounting && (
        <div className="countdown">
          {count}
        </div>
      )}

      {mode === 'default' && (
        <button
          className="take"
          onClick={isCaptured ? handleDownload : handleCapture}
        >
          {isCaptured ? 'Download' : 'Capture'}
        </button>
      )}
    </div>
  );
};

export default Photo; 