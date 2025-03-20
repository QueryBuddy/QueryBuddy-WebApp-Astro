export {};

declare const hasParent: boolean;

const form = document.getElementById('uploadForm') as HTMLFormElement;
const fileInput = document.getElementById('file') as HTMLInputElement;

if (form && fileInput) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const files = fileInput.files;
        if (!files || files.length === 0) return;
        
        const formData = new FormData();
        formData.append('file', files[0]);
        
        try {
            const response = await fetch('/api/uploadFile', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (hasParent) {
                    window.parent.postMessage({
                        type: 'upload',
                        data: {
                            path: data.path,
                            filename: data.filename
                        }
                    }, '*');
                } else {
                    alert('File uploaded successfully!');
                }
                form.reset();
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unknown error occurred');
            }
        }
    });
} 