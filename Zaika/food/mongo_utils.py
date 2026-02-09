from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "zaikaa_db")

try:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    orders_collection = db["orderlist"]
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    orders_collection = None

def insert_order_mongo(order_data):
    if orders_collection is not None:
        try:
            # Add a timestamp if it's not already there or confirm it's in a good format
            orders_collection.insert_one(order_data)
            print("Order inserted into MongoDB")
        except Exception as e:
            print(f"Error inserting into MongoDB: {e}")

def update_order_status_mongo(order_id, status):
    if orders_collection is not None:
        try:
            orders_collection.update_one(
                {"order_id": order_id}, 
                {"$set": {"status": status}}
            )
            print(f"Order status updated in MongoDB for order_id: {order_id}")
        except Exception as e:
            print(f"Error updating order status in MongoDB: {e}")

def update_order_token_mongo(email, token_id, timestamp, mode_of_payment, current_status="Approved"):
    if orders_collection is not None:
        try:
            orders_collection.update_many(
                {"email": email, "status": current_status, "tokenid": None},
                {"$set": {"tokenid": token_id, "timestamp": timestamp, "mode_of_payment": mode_of_payment}}
            )
            print(f"Order token updated in MongoDB for email: {email}")
        except Exception as e:
            print(f"Error updating order token in MongoDB: {e}")

def remove_order_mongo(order_id):
    if orders_collection is not None:
        try:
            orders_collection.delete_one({"order_id": order_id})
            print(f"Order removed from MongoDB for order_id: {order_id}")
        except Exception as e:
            print(f"Error removing order from MongoDB: {e}")

