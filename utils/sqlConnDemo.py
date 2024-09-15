import pymysql
from pymysql import Error

# Configuration details
mysql_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'nishanholla',
    'database': 'superjoin'
}

def test_mysql_connection():
    try:
        # Establish the connection
        connection = pymysql.connect(**mysql_config)

        if connection.open:
            print("Connected to MySQL as ID:", connection.get_server_info())
            # You can also fetch and print the current database
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            db = cursor.fetchone()
            print("Connected to database:", db[0])

    except Error as e:
        print("Error connecting to MySQL:", e)
    
    finally:
        if connection.open:
            cursor.close()
            connection.close()
            print("MySQL connection closed.")

if __name__ == "__main__":
    test_mysql_connection()
