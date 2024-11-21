import os
import torch
from torch.utils.data import Dataset
from PIL import Image
import xml.etree.ElementTree as ET

# Class Mapping
CLASS_MAPPING = {
    "D00": 1,
    "D01": 2,
    "D10": 3,
    "D11": 4,
    "D20": 5,
    "D40": 6,
    "D43": 7,
    "D44": 8,
}

class RoadDamageDataset(Dataset):
    def __init__(self, root, transforms=None):
        self.root = root
        self.transforms = transforms
        self.image_dir = os.path.join(root, "images")
        self.annotation_dir = os.path.join(root, "annotations", "xmls")
        self.image_files = sorted(os.listdir(self.image_dir))
        self.annotation_files = sorted(os.listdir(self.annotation_dir))
    
    def __len__(self):
        return len(self.image_files)
    
    def __getitem__(self, idx):
        # Load image
        img_path = os.path.join(self.image_dir, self.image_files[idx])
        img = Image.open(img_path).convert("RGB")
        
        # Load annotation
        anno_path = os.path.join(self.annotation_dir, self.annotation_files[idx])
        tree = ET.parse(anno_path)
        root = tree.getroot()
        
        boxes = []
        labels = []
        for obj in root.findall("object"):
            bndbox = obj.find("bndbox")
            if bndbox is not None:  # Only process if <bndbox> exists
                xmin = float(bndbox.find("xmin").text)
                ymin = float(bndbox.find("ymin").text)
                xmax = float(bndbox.find("xmax").text)
                ymax = float(bndbox.find("ymax").text)
                boxes.append([xmin, ymin, xmax, ymax])
                
                label = obj.find("name").text.strip()  # Extract and map label
                if label in CLASS_MAPPING:
                    labels.append(CLASS_MAPPING[label])
                else:
                    raise ValueError(f"Unknown class label: {label}")
        
        # Handle cases with no objects
        boxes = torch.tensor(boxes, dtype=torch.float32) if boxes else torch.empty((0, 4), dtype=torch.float32)
        labels = torch.tensor(labels, dtype=torch.int64) if labels else torch.empty((0,), dtype=torch.int64)
        
        target = {
            "boxes": boxes,
            "labels": labels
        }

        if self.transforms:
            img = self.transforms(img)

        return img, target
