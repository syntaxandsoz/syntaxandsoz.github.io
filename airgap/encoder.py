import cv2
import qrcode
import numpy as np
import json
import time
import sys

# Syntax & Soz - QR Video Encoder v1.0
# Converts text/JSON data into a video stream of QR codes.

def text_to_qr_video(data, filename="output.avi"):
    print(f">> Initializing Encoder for: {filename}")
    
    # 2 Frames per second
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(filename, fourcc, 2.0, (500, 500))
    
    # Split data into chunks of 200 chars
    chunks = [data[i:i+200] for i in range(0, len(data), 200)]
    
    print(f">> Total Chunks: {len(chunks)}")

    for i, chunk in enumerate(chunks):
        # Generate QR Code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(chunk)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert PIL image to OpenCV format
        frame = np.array(img.convert('RGB'))
        frame = cv2.resize(frame, (500, 500))
        
        # Write frame to video
        out.write(frame)
        
        # Progress Bar effect
        sys.stdout.write(f"\r[+] Encoding Frame {i+1}/{len(chunks)}")
        sys.stdout.flush()
        
    out.release()
    print("\n>> Video Sequence Complete. Saved as " + filename)

if __name__ == "__main__":
    # Dummy Data for demonstration
    sample_data = "{ 'project': 'AirGap', 'author': 'SyntaxAndSoz', 'key': '8299102' }" * 50
    text_to_qr_video(sample_data)