from faker import Faker
import json

fake = Faker()

def generate_ecommerce_data(num_entries):
    data = {
        "products": [],
        "categories": []
    }
    for _ in range(num_entries):
        data["products"].append({
            "product_id": fake.uuid4(),
            "name": fake.word(),
            "description": fake.text(),
            "price": round(fake.random_number(digits=4), 2),
            "stock": fake.random_int(min=0, max=100)
        })
    
    data["categories"] = list(set(fake.word() for _ in range(num_entries)))
    
    with open('ecommerce_data.json', 'w') as f:
        json.dump(data, f, indent=4)

def generate_stock_data(num_entries):
    data = {
        "stocks": []
    }
    for _ in range(num_entries):
        data["stocks"].append({
            "symbol": fake.lexify(text='???', letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            "company": fake.company(),
            "price": round(fake.random_number(digits=4), 2),
            "volume": fake.random_number(digits=6)
        })
    
    with open('stock_data.json', 'w') as f:
        json.dump(data, f, indent=4)

def generate_medical_data(num_entries):
    data = {
        "patients": [],
        "appointments": []
    }
    for _ in range(num_entries):
        data["patients"].append({
            "patient_id": fake.uuid4(),
            "name": fake.name(),
            "age": fake.random_int(min=1, max=100),
            "gender": fake.random_element(elements=('Male', 'Female')),
            "address": fake.address()
        })
        
        data["appointments"].append({
            "appointment_id": fake.uuid4(),
            "patient_id": fake.uuid4(),
            "date": fake.date_time_this_year().isoformat(),
            "doctor": fake.name(),
            "clinic": fake.company()
        })
    
    with open('medical_data.json', 'w') as f:
        json.dump(data, f, indent=4)

# Generate data
num_entries = 10  # Adjust as needed
generate_ecommerce_data(num_entries)
generate_stock_data(num_entries)
generate_medical_data(num_entries)
