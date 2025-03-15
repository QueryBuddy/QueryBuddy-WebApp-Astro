export {};

const form = document.getElementById('uploadForm') as HTMLFormElement;
const filesInput = document.getElementById('files') as HTMLInputElement;
const progress = document.getElementById('progress') as HTMLDivElement;

if (form && filesInput && progress) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const files = filesInput.files;
    if (!files) return;
    
    progress.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/uploadFile', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          progress.innerHTML += `<p>✅ ${file.name} uploaded successfully</p>`;
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        if (error instanceof Error) {
          progress.innerHTML += `<p>❌ ${file.name}: ${error.message}</p>`;
        } else {
          progress.innerHTML += `<p>❌ ${file.name}: Unknown error occurred</p>`;
        }
      }
    }
    
    form.reset();
  });
} 