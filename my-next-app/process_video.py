import cv2
from ultralytics import YOLO
import time
from tqdm import tqdm
import sys
import os
import argparse

def main(input_path, output_path):
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "yolo11s-200.pt")

    # Load the model
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"YOLO model not found at {model_path}")
    model = YOLO(model_path)
    class_names = model.names

    # Open the input video using the path passed from the command line
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise IOError(f"Cannot open video file: {input_path}")

    # Get video properties
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # How many seconds of the video do you want to process?
    # (You can remove or adjust this if you want the full video.)
    output_duration = 15  # in seconds
    max_frames = output_duration * fps

    # Ensure the frame width/height are even numbers (required by some codecs)
    if frame_width % 2 != 0:
        frame_width += 1
    if frame_height % 2 != 0:
        frame_height += 1

    # Prepare output
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

    # Start time to measure processing duration
    start_time = time.time()
    frame_count = 0

    with tqdm(total=max_frames, desc="Processing Video", unit="frame", ascii=True, file=sys.stdout) as pbar:
        while frame_count < max_frames:
            ret, img = cap.read()
            if not ret:
                break  # Reached end of file or error

            # YOLO model prediction (stream=True for real-time processing)
            results = model.predict(img, stream=True)

            # Draw boxes and labels on each detection
            for r in results:
                for box in r.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].int().tolist()
                    class_id = int(box.cls)
                    class_name = class_names[class_id]
                    # Draw bounding box
                    cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)
                    # Put class label
                    cv2.putText(img, class_name, (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                (255, 255, 255), 2)

            # Write the annotated frame to the output video
            out.write(img)

            # Print a progress percentage (optional)
            progress = min(int((frame_count / max_frames) * 100), 100)
            print(f"PROGRESS:{progress}%", flush=True)

            pbar.update(1)
            frame_count += 1

    # Release resources
    cap.release()
    out.release()
    cv2.destroyAllWindows()

    # Print total processing time
    end_time = time.time()
    total_time = end_time - start_time
    minutes = int(total_time // 60)
    seconds = total_time % 60
    print(f"Total processing time: {minutes} minutes {seconds:.2f} seconds")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('input_path', help="Path to the input video")
    parser.add_argument('output_path', help="Path to save the processed output video")
    args = parser.parse_args()
    main(args.input_path, args.output_path)
