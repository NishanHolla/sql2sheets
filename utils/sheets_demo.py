from google.oauth2 import service_account
from googleapiclient.discovery import build

# Path to the service account JSON key file
SERVICE_ACCOUNT_FILE = 'superjoin-sheets.json'

# Define the necessary scopes
SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']

# Create credentials for the service account
credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# Initialize the Sheets API
service_sheets = build('sheets', 'v4', credentials=credentials)

# Initialize the Drive API to share the sheet
service_drive = build('drive', 'v3', credentials=credentials)

def create_google_sheet():
    # Create a new Google Sheet
    spreadsheet = {
        'properties': {
            'title': 'Test Google Sheet'
        }
    }
    
    sheet = service_sheets.spreadsheets().create(body=spreadsheet, fields='spreadsheetId').execute()
    spreadsheet_id = sheet.get('spreadsheetId')
    
    print(f'Spreadsheet created. Spreadsheet ID: {spreadsheet_id}')
    
    return spreadsheet_id

def share_google_sheet(spreadsheet_id, email):
    # Share the Google Sheet with your email
    permission = {
        'type': 'user',
        'role': 'writer',  # 'reader' for read-only access, 'writer' for edit access
        'emailAddress': email
    }
    
    # Share the spreadsheet using the Drive API
    service_drive.permissions().create(fileId=spreadsheet_id, body=permission, fields='id').execute()
    
    print(f'Spreadsheet shared with {email}')

if __name__ == '__main__':
    # Replace with the email you want to share the sheet with
    recipient_email = 'hollanishan@gmail.com'
    
    # Create a Google Sheet
    spreadsheet_id = create_google_sheet()
    
    # Share the sheet with the specified email
    share_google_sheet(spreadsheet_id, recipient_email)
