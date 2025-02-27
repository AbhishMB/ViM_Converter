from django.shortcuts import render

# Create your views here.
import os
import cv2
import numpy as np
from django.conf import settings
from django.core.files.storage import default_storage
from django.http import JsonResponse, StreamingHttpResponse, FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import uploadedFile

@api_view(['POST'])
def upload(request):
    file = request.FILES['file']
    uploaded_file = uploadedFile.objects.create(file = file)
    return JsonResponse({"file_url": uploaded_file.file.url})


def convert_to_bw(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
     # Ensure 'processed/' directory exists
    processed_dir = os.path.join(settings.MEDIA_ROOT, "processed")
    os.makedirs(processed_dir, exist_ok=True)

    processed_path = os.path.join(processed_dir, os.path.basename(image_path))
    cv2.imwrite(processed_path, gray)  # Save processed image

    return processed_path


@api_view(['POST'])
def process(request):
    
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        file_name = uploaded_file.name
        
        
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)
        with default_storage.open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        
        # Create a "processed" directory inside MEDIA_ROOT if it doesn't exist.
        processed_dir = os.path.join(settings.MEDIA_ROOT, 'processed')
        os.makedirs(processed_dir, exist_ok=True)
        
        # Check if the file is a video based on its extension.
        if file_name.lower().endswith(('.mp4', '.avi', '.mov')):
            processed_file_name = f"processed_{file_name}"
            processed_path = os.path.join(processed_dir, processed_file_name)
            
            cap = cv2.VideoCapture(file_path)
            if not cap.isOpened():
                return JsonResponse({"error": "Could not open input video."}, status=400)

            frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            
            
      
            fps = cap.get(cv2.CAP_PROP_FPS)
            if fps <= 0:
                fps = 30.0

            print(f"Input Video Details: Width={frame_width}, Height={frame_height}, FPS={fps}")

              
            output_size = (frame_width, frame_height)
            # Use 'mp4v' codec and set isColor=True since we will write a 3-channel image.
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            #fourcc = cv2.VideoWriter_fourcc(*'XVID')  # Change 'mp4v' to 'XVID'

            out = cv2.VideoWriter(processed_path, fourcc, fps, output_size, isColor=False)

            frame_count = 0

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    print("End of video reached or cannot read frame.")
                    break

                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                if gray is not None and gray.size > 0:
                    out.write(gray)
                    frame_count += 1
                else:
                    print(f"Warning: Skipping frame {frame_count}, invalid frame.")


                
                # processed_frame = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

                # # Write frame
                # if processed_frame is None or processed_frame.size == 0:
                #     print(f"Warning: Skipping frame {frame_count}, invalid frame.")
                # else:
                #     out.write(processed_frame)
                # frame_count += 1

                if frame_count % 10 == 0:  # Print every 10 frames
                    print(f"Processed {frame_count} frames...")

            cap.release()
            out.release()

            if frame_count == 0:
                print("No frames were processed, possible issue with VideoCapture.")
                return JsonResponse({"error": "No frames were processed."}, status=400)

            # Verify the output video file
            if not os.path.exists(processed_path):
                return JsonResponse({"error": "Output video file was not created."}, status=500)

            # Check the output video duration and size
            output_cap = cv2.VideoCapture(processed_path)
            output_frame_count = int(output_cap.get(cv2.CAP_PROP_FRAME_COUNT))
            output_fps = output_cap.get(cv2.CAP_PROP_FPS)
            output_duration = output_frame_count / output_fps if output_fps > 0 else 0
            output_cap.release()

            print(f"Output Video Details: Frames={output_frame_count}, FPS={output_fps}, Duration={output_duration:.2f}s")

            return JsonResponse({
                'processed_video_url': settings.MEDIA_URL + 'processed/' + processed_file_name
            })
        
        # Check if the file is an image.
        elif file_name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp')):
            processed_file_name = f"processed_{file_name}"
            processed_path = os.path.join(processed_dir, processed_file_name)
            
            # Read the image using OpenCV.
            image = cv2.imread(file_path)
            if image is None:
                return JsonResponse({"error": "Could not read the image file."}, status=400)
            # Convert the image to grayscale.
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            # Save the processed grayscale image.
            cv2.imwrite(processed_path, gray)
            
            return JsonResponse({
                'processed_image_url': settings.MEDIA_URL + 'processed/' + processed_file_name
            })
        
        else:
            return JsonResponse({'error': 'Invalid file type'}, status=400)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

# def generate_video_stream(video_path):
#     cap = cv2.VideoCapture(video_path)
#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break
#         gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         _, buffer = cv2.imencode('.jpg', gray_frame)
#         frame_bytes = buffer.tobytes()
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
#     cap.release()

# @api_view(['GET'])
# def stream_video(request):
#     """Streams the processed video"""
#     video_path = request.GET.get("file_url")
#     if not video_path:
#         return Response({"error": "File URL missing"}, status=400)

#     full_path = os.path.join(settings.MEDIA_ROOT, video_path.replace(settings.MEDIA_URL, ""))
#     if not os.path.exists(full_path):
#         return Response({"error": "File not found"}, status=404)

#     return FileResponse(open(full_path, "rb"), content_type="video/mp4")


import cv2
import os
from django.conf import settings
from django.http import StreamingHttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view

def generate_video_stream(video_path):
    """Generator function to yield grayscale frames as an MJPEG stream."""
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        return
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        _, buffer = cv2.imencode('.jpg', gray_frame)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()


@api_view(['GET'])
def stream_video(request):
    """Streams the processed video as an MJPEG stream (frame-by-frame)."""
    video_path = request.GET.get("file_url")
    if not video_path:
        return Response({"error": "File URL missing"}, status=400)

    # Ensure proper path handling
    full_path = os.path.join(settings.MEDIA_ROOT, video_path.replace(settings.MEDIA_URL, "").lstrip('/'))
    if not os.path.exists(full_path):
        return Response({"error": "File not found"}, status=404)

    return StreamingHttpResponse(generate_video_stream(full_path), content_type="multipart/x-mixed-replace; boundary=frame")
