import json
from faker import Faker

# Initialize Faker
fake = Faker()

def generate_fake_data(num_entries):
    """Generate fake data for the specified number of entries."""
    data = {
        'Name': [],
        'Value': []
    }

    for _ in range(num_entries):
        data['Name'].append(fake.name())
        data['Value'].append(fake.pricetag())

    return data

def save_to_json(data, filename):
    """Save the generated data to a JSON file."""
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

if __name__ == '__main__':
    num_entries = 10  # Specify the number of fake entries you want
    fake_data = generate_fake_data(num_entries)
    save_to_json(fake_data, 'fake_data.json')
    print('Fake data has been generated and saved to fake_data.json')
