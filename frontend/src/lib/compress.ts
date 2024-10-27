// @/lib/compress.ts
// 压缩和加密相关代码

export async function compressImage(base64Image: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > 800) {
            height *= 800 / width;
            width = 800;
          }
        } else {
          if (height > 800) {
            width *= 800 / height;
            height = 800;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result as string;
              resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/webp', 0.8);
      };
      img.onerror = reject;
      img.src = base64Image;
    });
  }