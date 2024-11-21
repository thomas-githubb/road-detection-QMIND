import torch
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from torchvision.transforms import transforms
import utils  # Utility functions for training and evaluation
from model import get_model


# Configuration
num_classes = 8
batch_size = 4
learning_rate = 0.005
num_epochs = 10
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

# Dataset and DataLoader
train_transform = transforms.Compose([
    transforms.ToTensor()
])

train_dataset = ImageFolder(root='path_to_train_dataset', transform=train_transform)
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, collate_fn=utils.collate_fn)

# Load model
model = get_model(num_classes)
model.to(device)

# Optimizer and learning rate scheduler
optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate, momentum=0.9, weight_decay=0.0005)
lr_scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=3, gamma=0.1)

# Training loop
for epoch in range(num_epochs):
    model.train()
    for images, targets in train_loader:
        images = [img.to(device) for img in images]
        targets = [{k: v.to(device) for k, v in t.items()} for t in targets]
        
        loss_dict = model(images, targets)
        losses = sum(loss for loss in loss_dict.values())
        
        optimizer.zero_grad()
        losses.backward()
        optimizer.step()
    
    lr_scheduler.step()
    print(f"Epoch {epoch+1}, Loss: {losses.item()}")
    
# Save the trained model
torch.save(model.state_dict(), 'faster_rcnn_road_damage.pth')
