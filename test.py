import cv2
from ultralytics import YOLO
import time
from tqdm import tqdm

# Load the model
model = YOLO("yolov11s_200_epochs.pt")
class_names = model.names

# Input and output video settings
cap = cv2.VideoCapture('p.mp4')
fps = int(cap.get(cv2.CAP_PROP_FPS))
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
output_duration = 60  # Output duration in seconds
output_file = 'YOLO11s-200.mp4'

# Ensure the frame width and height are divisible by 2
frame_width = frame_width if frame_width % 2 == 0 else frame_width + 1
frame_height = frame_height if frame_height % 2 == 0 else frame_height + 1

# Define the codec and create VideoWriter object
fourcc = cv2.VideoWriter_fourcc(*'avc1')
out = cv2.VideoWriter(output_file, fourcc, fps, (frame_width, frame_height))

# Calculate total frames to process
max_frames = output_duration * fps

# Initialize frame count
frame_count = 0

# Start time to calculate total processing time
start_time = time.time()

# Progress bar setup
with tqdm(total=max_frames, desc="Processing Video", unit="frame") as pbar:
    while frame_count < max_frames:
        ret, img = cap.read()
        if not ret:
            break

        # YOLO model prediction
        results = model.predict(img, stream=True)

        # Process detections
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].int().tolist()
                class_id = int(box.cls)
                class_name = class_names[class_id]

                # Draw bounding boxes and labels
                cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(img, class_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

        # Save the frame to the output video
        out.write(img)

        # Update progress bar
        pbar.update(1)

        # Increment frame count
        frame_count += 1

# Release resources
cap.release()
out.release()
cv2.destroyAllWindows()

# End time and total time calculation
end_time = time.time()
total_time = end_time - start_time

# Convert total time to minutes and seconds
minutes = int(total_time // 60)
seconds = total_time % 60

# Print total processing time in seconds
print(f"Total processing time: {minutes} minutes {seconds:.2f} seconds")

