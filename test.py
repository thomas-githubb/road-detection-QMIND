
import torch
from torchvision.transforms import transforms
from PIL import Image
from model import get_model

# Configuration
num_classes = 8
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

# Load model
model = get_model(num_classes)
model.load_state_dict(torch.load('faster_rcnn_road_damage.pth'))
model.to(device)
model.eval()

# Load a test image
test_image_path = 'path_to_test_image.jpg'
image = Image.open(test_image_path).convert('RGB')
transform = transforms.Compose([transforms.ToTensor()])
image_tensor = transform(image).unsqueeze(0).to(device)

# Make prediction
with torch.no_grad():
    predictions = model(image_tensor)

# Visualize predictions
print(predictions)
