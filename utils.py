def collate_fn(batch):
    """
    Custom collate function for DataLoader to handle batches of images and annotations.
    """
    return tuple(zip(*batch))