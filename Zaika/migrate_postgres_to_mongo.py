import os
import django
from django.db import connection
from datetime import datetime
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Zaikaa.settings')
django.setup()

from food.mongo_utils import orders_collection

def migrate_data():
    if orders_collection is None:
        print("Error: Could not connect to MongoDB. Check your connection string.")
        return

    try:
        with connection.cursor() as cursor:
            # 1. Fetch all data from PostgreSQL
            cursor.execute('SELECT * FROM "orderlist"')
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

        if not rows:
            print("No orders found in PostgreSQL to migrate.")
            return

        print(f"Found {len(rows)} orders in PostgreSQL. Starting migration...")

        count = 0
        for row in rows:
            # Create a dictionary for the row using column names
            order_data = dict(zip(columns, row))
            
            # Convert Decimal objects to float for MongoDB compatibility
            for key, value in order_data.items():
                if isinstance(value, Decimal):
                    order_data[key] = float(value)

            # Use order_id as the unique identifier for upsert
            order_id = order_data.get('order_id')
            
            if order_id:
                try:
                    # Upsert to prevent duplicates if run multiple times
                    orders_collection.update_one(
                        {"order_id": order_id},
                        {"$set": order_data},
                        upsert=True
                    )
                    count += 1
                except Exception as e:
                    print(f"Failed to migrate order {order_id}: {e}")
            else:
                 print(f"Skipping row with missing order_id: {order_data}")


        print(f"Successfully migrated {count} orders to MongoDB.")

    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == '__main__':
    migrate_data()
